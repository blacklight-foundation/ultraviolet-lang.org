---
title: "Concrete Data Types"
description: "12. Concrete Data Types of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T13:48:04.933Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 12. Concrete Data Types

### 12.1 Primitive Types

#### 12.1.1 Syntax

```text
```

primitive_type  ::= signed_int_type
                  | unsigned_int_type
                  | float_type
                  | "bool"
                  | "char"
                  | "(" ")"
                  | "!"
signed_int_type ::= "i8" | "i16" | "i32" | "i64" | "i128" | "isize"
unsigned_int_type ::= "u8" | "u16" | "u32" | "u64" | "u128" | "usize"
float_type      ::= "f16" | "f32" | "f64"
```

#### 12.1.2 Parsing

PrimLexemeSet = {`i8`, `i16`, `i32`, `i64`, `i128`, `isize`, `u8`, `u16`, `u32`, `u64`, `u128`, `usize`, `f16`, `f32`, `f64`, `bool`, `char`}

**(Parse-Prim-Type)**

```text
IsIdent(Tok(P))    Lexeme(Tok(P)) ∈ PrimLexemeSet
────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (Advance(P), TypePrim(Lexeme(Tok(P))))

**(Parse-Unit-Type)**
IsPunc(Tok(P), "(")    IsPunc(Tok(Advance(P)), ")")
──────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (Advance(Advance(P)), TypePrim("()"))

**(Parse-Never-Type)**
IsOp(Tok(P), "!")
────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (Advance(P), TypePrim("!"))

#### 12.1.3 AST Representation / Form

PrimitiveTypeName = {`i8`, `i16`, `i32`, `i64`, `i128`, `isize`, `u8`, `u16`, `u32`, `u64`, `u128`, `usize`, `f16`, `f32`, `f64`, `bool`, `char`, `()`, `!`}

```text
TypePrim = ⟨name⟩ where name ∈ PrimitiveTypeName

IntTypes = {`i8`, `i16`, `i32`, `i64`, `i128`, `u8`, `u16`, `u32`, `u64`, `u128`, `isize`, `usize`}
FloatTypes = {`f16`, `f32`, `f64`}
SignedIntTypes = {`i8`, `i16`, `i32`, `i64`, `i128`, `isize`}
UnsignedIntTypes = {`u8`, `u16`, `u32`, `u64`, `u128`, `usize`}
NumericTypes = IntTypes ∪ FloatTypes

#### 12.1.4 Static Semantics

```text
TypeWFJudg = {Γ ⊢ T wf}

**(WF-Prim)**

```text
T = TypePrim(name)    name ∈ {`i8`, `i16`, `i32`, `i64`, `i128`, `isize`, `u8`, `u16`, `u32`, `u64`, `u128`, `usize`, `f16`, `f32`, `f64`, `bool`, `char`, `()`, `!`}
────────────────────────────────────────

```text
Γ ⊢ T wf

FloatFormat("f16") = `binary16`    FloatFormat("f32") = `binary32`    FloatFormat("f64") = `binary64`
FloatBitWidth("f16") = 16    FloatBitWidth("f32") = 32    FloatBitWidth("f64") = 64
FloatValueSet(t) = { v | v is a value representable by IEEE 754-2019 format FloatFormat(t) }

```text
IEEE754Encode(t, v) = bits ⇔ v ∈ FloatValueSet(t) ∧ bits ∈ [0, 2^{FloatBitWidth(t)} - 1] ∧ ((v is NaN in IEEE 754-2019 format FloatFormat(t) ∧ bits = CanonicalNaNBits(t)) ∨ (v is not NaN in IEEE 754-2019 format FloatFormat(t) ∧ bits is the IEEE 754-2019 encoding of v in format FloatFormat(t)))
CanonicalNaNBits("f16") = 0x7E00    CanonicalNaNBits("f32") = 0x7FC00000    CanonicalNaNBits("f64") = 0x7FF8000000000000

```text
CanonicalNaN(t) = v ⇔ IEEE754Encode(t, v) = CanonicalNaNBits(t)

```text
NonNaNValueSet(t) = { v ∈ FloatValueSet(t) | IEEE754Encode(t, v) ≠ CanonicalNaNBits(t) }
LSB(n) = n mod 2

```text
EvenSignificandLSB(t, v) ⇔ LSB(IEEE754Encode(t, v)) = 0

```text
IEEE754Bits(t, v) = bits ⇔ v ∈ FloatValueSet(t) ∧ IEEE754Encode(t, v) = bits

DefaultInt = `i32`
DefaultFloat = `f32`

IntWidth(`i8`) = 8    IntWidth(`i16`) = 16    IntWidth(`i32`) = 32    IntWidth(`i64`) = 64    IntWidth(`i128`) = 128
IntWidth(`u8`) = 8    IntWidth(`u16`) = 16    IntWidth(`u32`) = 32    IntWidth(`u64`) = 64    IntWidth(`u128`) = 128
IntWidth(`isize`) = 8 × PointerSize    IntWidth(`usize`) = 8 × PointerSize

RangeOf : PrimitiveTypeName ⇀ ℘(ℝ)

```text
RangeOf(t) = [-2^{w-1}, 2^{w-1} - 1] if t ∈ SignedIntTypes ∧ w = IntWidth(t)

```text
RangeOf(t) = [0, 2^{w} - 1] if t ∈ UnsignedIntTypes ∧ w = IntWidth(t)
RangeOf(t) undefined otherwise

```text
InRange(v, T) ⇔ v ∈ RangeOf(T)

#### 12.1.5 Dynamic Semantics

ValueType(IntVal(t, x)) = TypePrim(t)
ValueType(FloatVal(t, v)) = TypePrim(t)

```text
ValueType(v) = TypePrim("bool") ⇔ ∃ b. v = BoolVal(b)

```text
ValueType(v) = TypePrim("char") ⇔ ∃ u. v = CharVal(u)
ValueType(BoolVal(true)) = TypePrim("bool")
ValueType(BoolVal(false)) = TypePrim("bool")
ValueType(CharVal(u)) = TypePrim("char")
ValueType(UnitVal) = TypePrim("()")

Primitive-operation evaluation is defined by §16.4. This section introduces no additional reduction rules beyond the primitive value domains above.

#### 12.1.6 Lowering

```text
ValueBits(TypePrim("bool"), v) = bits ⇔ (v = BoolVal(true) ∧ bits = [0x01]) ∨ (v = BoolVal(false) ∧ bits = [0x00])

```text
ValueBits(TypePrim("char"), v) = bits ⇔ v = CharVal(u) ∧ LEBytes(u, 4) = bits

```text
ValueBits(TypePrim("()"), v) = bits ⇔ v = UnitVal ∧ bits = []

```text
ValueBits(TypePrim(t), v) = bits ⇔ t ∈ IntTypes ∧ v = IntVal(t, x) ∧ LEBytes(x, sizeof(TypePrim(t))) = bits

```text
ValueBits(TypePrim(t), v) = bits ⇔ t ∈ FloatTypes ∧ v = FloatVal(t, x) ∧ LEBytes(IEEE754Bits(t, x), sizeof(TypePrim(t))) = bits

Primitive-type layout and ABI classification are defined by Chapter 24.

#### 12.1.7 Diagnostics

Diagnostics are defined for malformed primitive type syntax and for literal-range or suffix mismatches at the primitive use sites defined by §16.1. This section introduces no construct-specific diagnostic beyond primitive-type well-formedness.

### 12.2 Tuples

#### 12.2.1 Syntax

```text
```

tuple_type       ::= "(" ")"
                   | "(" type ";)"
                   | "(" type ("," type)+ trailing_comma? ")"
tuple_expr       ::= "(" ")"
                   | "(" expr ";)"
                   | "(" expr ("," expr)+ trailing_comma? ")"
tuple_projection ::= postfix_expr "." int_literal
```

The singleton comma forms `("(" type ",)")` and `("(" expr ",)")` are ill-formed. A trailing comma denotes continuation only and does not create a one-element tuple.

#### 12.2.2 Parsing

**(Parse-Tuple-Type)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseTupleTypeElems(Advance(P)) ⇓ (P_1, elems)    elems ≠ []    IsPunc(Tok(P_1), ")")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (Advance(P_1), TypeTuple(elems))

**(Parse-TupleTypeElems-Empty)**
IsPunc(Tok(P), ")")
──────────────────────────────────────────────

```text
Γ ⊢ ParseTupleTypeElems(P) ⇓ (P, [])

**(Parse-TupleTypeElems-One)**

```text
Γ ⊢ ParseType(P) ⇓ (P_1, t)    IsPunc(Tok(P_1), ";")
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTupleTypeElems(P) ⇓ (Advance(P_1), [t])

**(Parse-TupleTypeElems-Many)**

```text
Γ ⊢ ParseType(P) ⇓ (P_1, t_1)    IsPunc(Tok(P_1), ",")    Γ ⊢ ParseType(Advance(P_1)) ⇓ (P_2, t_2)    Γ ⊢ ParseTypeListTail(P_2, [t_2]) ⇓ (P_3, ts)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTupleTypeElems(P) ⇓ (P_3, [t_1] ++ ts)

ParenDelta(Punctuator("(")) = 1
ParenDelta(Punctuator(")")) = -1

```text
ParenDelta(t) = 0 if t.kind ∉ {Punctuator("("), Punctuator(")")}

BracketDelta(Punctuator("[")) = 1
BracketDelta(Punctuator("]")) = -1

```text
BracketDelta(t) = 0 if t.kind ∉ {Punctuator("["), Punctuator("]")}

BraceDelta(Punctuator("{")) = 1
BraceDelta(Punctuator("}")) = -1

```text
BraceDelta(t) = 0 if t.kind ∉ {Punctuator("{"), Punctuator("}")}

```text
TupleScanDepth = ⟨p, q, r⟩ where p, q, r ∈ Nat

```text
TupleScan(P, d) ⇓ b ⇔ TupleScan(P, ⟨d, 0, 0⟩) ⇓ b

```text
TupleScanStep(⟨p, q, r⟩, t) = ⟨p + ParenDelta(t), max(0, q + BracketDelta(t)), max(0, r + BraceDelta(t))⟩

```text
TupleScanOuterSep(⟨p, q, r⟩) ⇔ p = 1 ∧ q = 0 ∧ r = 0

```text
TupleScanSingletonComma(P) ⇔ Tok(P) = Punctuator(",") ∧ IsPunc(Tok(SkipNL(Advance(P))), ")")

```text
TupleScanEndParen(P, ⟨p, q, r⟩) ⇔ Tok(P) = Punctuator(")") ∧ p = 1

```text
TupleScanSep(P, D) ⇔ Tok(P) ∈ {Punctuator(","), Punctuator(";")} ∧ TupleScanOuterSep(D)

```text
TupleScanAdvance(P, D) ⇔ Tok(P) ≠ EOF ∧ ¬ TupleScanEndParen(P, D) ∧ ¬ TupleScanSep(P, D)

```text
TupleScan(P, D) ⇓ b
Tok(P) = EOF
────────────────────────────────────────

```text
TupleScan(P, D) ⇓ false
TupleScanEndParen(P, D)
────────────────────────────────────────────

```text
TupleScan(P, D) ⇓ false
TupleScanSingletonComma(P) ∧ TupleScanOuterSep(D)
────────────────────────────────────────────────────────

```text
TupleScan(P, D) ⇓ false
TupleScanSep(P, D) ∧ ¬ TupleScanSingletonComma(P)
──────────────────────────────────────────────

```text
TupleScan(P, D) ⇓ true

```text
TupleScanAdvance(P, D)    TupleScan(Advance(P), TupleScanStep(D, Tok(P))) ⇓ b
───────────────────────────────────────────────────────────────────────────────────────────────────────

```text
TupleScan(P, D) ⇓ b

```text
TupleParen(P) ⇔ IsPunc(Tok(P), "(") ∧ (IsPunc(Tok(Advance(P)), ")") ∨ TupleScan(Advance(P), 1) ⇓ true)

**(Parse-Tuple-Literal)**

```text
IsPunc(Tok(P), "(")    TupleParen(P)    Γ ⊢ ParseTupleExprElems(Advance(P)) ⇓ (P_1, elems)    IsPunc(Tok(P_1), ")")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_1), TupleExpr(elems))

**(Parse-TupleExprElems-Empty)**
IsPunc(Tok(P), ")")
──────────────────────────────────────────────

```text
Γ ⊢ ParseTupleExprElems(P) ⇓ (P, [])

**(Parse-TupleExprElems-Single)**

```text
Γ ⊢ ParseExpr(P) ⇓ (P_1, e)    IsPunc(Tok(P_1), ";")
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTupleExprElems(P) ⇓ (Advance(P_1), [e])

**(Parse-TupleExprElems-Many)**

```text
Γ ⊢ ParseExpr(P) ⇓ (P_1, e_1)    IsPunc(Tok(P_1), ",")    Γ ⊢ ParseExpr(Advance(P_1)) ⇓ (P_2, e_2)    Γ ⊢ ParseExprListTail(P_2, [e_2]) ⇓ (P_3, es)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTupleExprElems(P) ⇓ (P_3, [e_1] ++ es)

**(Postfix-TupleIndex)**
IsPunc(Tok(P), ".")    t = Tok(Advance(P))    t.kind = IntLiteral    idx = IntValue(t)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PostfixStep(P, e) ⇓ (Advance(Advance(P)), TupleAccess(e, idx))

#### 12.2.3 AST Representation / Form

```text
TypeTuple = ⟨elems⟩ where elems ∈ [Type]

```text
TupleExpr = ⟨elems⟩ where elems ∈ [Expr]

```text
TupleAccess = ⟨base, index⟩ where base ∈ Expr ∧ index ∈ ℤ

```text
TupleFields([T_1, …, T_n]) = [⟨0, T_1⟩, …, ⟨n-1, T_n⟩]

#### 12.2.4 Static Semantics

**(WF-Tuple)**

```text
T = TypeTuple([T_1, …, T_n])    ∀ i, Γ ⊢ T_i wf
────────────────────────────────────────

```text
Γ ⊢ T wf

**(T-Tuple-Unit)**
────────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleExpr([]) : TypePrim("()")

**(T-Tuple)**

```text
n ≥ 1    ∀ i, Γ ⊢ e_i : T_i
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleExpr([e_1, …, e_n]) : TypeTuple([T_1, …, T_n])

**(T-Tuple-Index)**

```text
Γ ⊢ e : TypeTuple([T_0, …, T_{n-1}])    0 ≤ i < n    BitcopyType(T_i)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleAccess(e, i) : T_i

**(T-Tuple-Index-Perm)**

```text
Γ ⊢ e : TypePerm(p, TypeTuple([T_0, …, T_{n-1}]))    0 ≤ i < n    BitcopyType(TypePerm(p, T_i))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleAccess(e, i) : TypePerm(p, T_i)

**(P-Tuple-Index)**

```text
Γ ⊢ e :place TypeTuple([T_0, …, T_{n-1}])    0 ≤ i < n
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleAccess(e, i) :place T_i

**(P-Tuple-Index-Perm)**

```text
Γ ⊢ e :place TypePerm(p, TypeTuple([T_0, …, T_{n-1}]))    0 ≤ i < n
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleAccess(e, i) :place TypePerm(p, T_i)

```text
ConstTupleIndex(i) ⇔ ∃ n ∈ ℤ. i = n

**(TupleIndex-NonConst)**
¬ ConstTupleIndex(i)    c = Code(TupleIndex-NonConst)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleAccess(e, i) ⇑ c

**(TupleIndex-OOB)**

```text
Γ ⊢ e : TypeTuple([T_0, …, T_{n-1}])    (i < 0 ∨ i ≥ n)    c = Code(TupleIndex-OOB)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleAccess(e, i) ⇑ c

**(TupleAccess-NotTuple)**

```text
Γ ⊢ e : T    StripPerm(T) ≠ TypeTuple(_)    c = Code(TupleAccess-NotTuple)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleAccess(e, i) ⇑ c

Tuple-type pattern rules are defined by §17.2.

#### 12.2.5 Dynamic Semantics

```text
ValueType((v_1, …, v_n)) = TypeTuple([T_1, …, T_n]) ⇔ ∀ i. ValueType(v_i) = T_i

**(EvalSigma-Tuple)**

```text
Γ ⊢ EvalListSigma(es, σ) ⇓ (Val(vec_v), σ_1)
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(TupleExpr(es), σ) ⇓ (Val((v_1, …, v_n)), σ_1)

**(EvalSigma-Tuple-Ctrl)**

```text
Γ ⊢ EvalListSigma(es, σ) ⇓ (Ctrl(κ), σ_1)
───────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(TupleExpr(es), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-TupleAccess)**

```text
Γ ⊢ EvalSigma(base, σ) ⇓ (Val(v_b), σ_1)    TupleValue(v_b, i) = v_i
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(TupleAccess(base, i), σ) ⇓ (Val(v_i), σ_1)

**(EvalSigma-TupleAccess-Ctrl)**

```text
Γ ⊢ EvalSigma(base, σ) ⇓ (Ctrl(κ), σ_1)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(TupleAccess(base, i), σ) ⇓ (Ctrl(κ), σ_1)

#### 12.2.6 Lowering

TupleLayoutJudg = {TupleLayout}

**(Layout-Tuple-Empty)**
────────────────────────────────────────────────────────

```text
Γ ⊢ TupleLayout([]) ⇓ ⟨0, 1, []⟩

**(Layout-Tuple-Cons)**

```text
n ≥ 1    TupleFields([T_1, …, T_n]) = fields    RecordLayout(fields) ⇓ ⟨size, align, offsets⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleLayout([T_1, …, T_n]) ⇓ ⟨size, align, offsets⟩

**(Size-Tuple)**

```text
TupleLayout([T_1, …, T_n]) ⇓ ⟨size, _, _⟩
──────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(TypeTuple([T_1, …, T_n])) = size

**(Align-Tuple)**

```text
TupleLayout([T_1, …, T_n]) ⇓ ⟨_, align, _⟩
───────────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(TypeTuple([T_1, …, T_n])) = align

**(Layout-Tuple)**

```text
TupleLayout([T_1, …, T_n]) ⇓ ⟨size, align, _⟩
───────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(TypeTuple([T_1, …, T_n])) ⇓ ⟨size, align⟩

```text
ValueBits(TypeTuple([T_1, …, T_n]), (v_1, …, v_n)) = bits ⇔ TupleLayout([T_1, …, T_n]) ⇓ ⟨size, _, offsets⟩ ∧ StructBits([T_1, …, T_n], [v_1, …, v_n], offsets, size) = bits

**(Lower-Expr-Tuple)**

```text
Γ ⊢ LowerList(es) ⇓ ⟨IR, vec_v⟩
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(TupleExpr(es)) ⇓ ⟨IR, (v_1, …, v_n)⟩

#### 12.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                  |
| ------------ | -------- | ------------ | ---------------------------------------------------------- |
| `E-TYP-1801` | Error    | Compile-time | Tuple index out of bounds                                  |
| `E-TYP-1802` | Error    | Compile-time | Tuple index is not a compile-time constant integer literal |
| `E-TYP-1803` | Error    | Compile-time | Tuple arity mismatch in assignment or pattern              |
| `E-SEM-2524` | Error    | Compile-time | Tuple access on non-tuple                                  |

### 12.3 Arrays

#### 12.3.1 Syntax

```text
```

array_type    ::= "[" type ";" expr "]"
array_expr    ::= "[" array_segment_list? "]"
array_segment_list ::= array_segment ("," array_segment)*
array_segment ::= expr | expr ";" expr
index_expr    ::= postfix_expr "[" expr "]"
```

#### 12.3.2 Parsing

**(Parse-Array-Type)**

```text
IsPunc(Tok(P), "[")    Γ ⊢ ParseType(Advance(P)) ⇓ (P_1, t)    IsPunc(Tok(P_1), ";")    Γ ⊢ ParseExpr(Advance(P_1)) ⇓ (P_2, e)    IsPunc(Tok(P_2), "]")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (Advance(P_2), TypeArray(t, e))

**(Parse-Array-Segment-Elem)**

```text
Γ ⊢ ParseExpr(P) ⇓ (P_1, value)    ¬ IsPunc(Tok(P_1), ";")
────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseArraySegment(P) ⇓ (P_1, ArrayElemSegment(value))

**(Parse-Array-Segment-Repeat)**

```text
Γ ⊢ ParseExpr(P) ⇓ (P_1, value)    IsPunc(Tok(P_1), ";")    Γ ⊢ ParseExpr(Advance(P_1)) ⇓ (P_2, count)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseArraySegment(P) ⇓ (P_2, ArrayRepeatSegment(value, count))

**(Parse-Array-Segment-List-Empty)**
───────────────────────────────────────────────

```text
Γ ⊢ ParseArraySegmentList(P) ⇓ (P, [])

**(Parse-Array-Segment-List-Single)**

```text
Γ ⊢ ParseArraySegment(P) ⇓ (P_1, seg)    ¬ IsPunc(Tok(P_1), ",")
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseArraySegmentList(P) ⇓ (P_1, [seg])

**(Parse-Array-Segment-List-Comma)**

```text
Γ ⊢ ParseArraySegment(P) ⇓ (P_1, seg)    IsPunc(Tok(P_1), ",")    Γ ⊢ ParseArraySegmentList(Advance(P_1)) ⇓ (P_2, segs)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseArraySegmentList(P) ⇓ (P_2, [seg] ++ segs)

**(Parse-Array-Literal)**

```text
IsPunc(Tok(P), "[")    Γ ⊢ ParseArraySegmentList(Advance(P)) ⇓ (P_1, segs)    IsPunc(Tok(P_1), "]")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_1), ArrayExpr(segs))

**(Postfix-Index)**

```text
IsPunc(Tok(P), "[")    Γ ⊢ ParseExpr(Advance(P)) ⇓ (P_1, idx)    IsPunc(Tok(P_1), "]")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PostfixStep(P, e) ⇓ (Advance(P_1), IndexAccess(e, idx))

#### 12.3.3 AST Representation / Form

```text
TypeArray = ⟨elem, size_expr⟩ where elem ∈ Type ∧ size_expr ∈ Expr

```text
ArraySegment = ArrayElemSegment(value) | ArrayRepeatSegment(value, count) where value ∈ Expr ∧ count ∈ Expr

```text
ArrayExpr = ⟨segments⟩ where segments ∈ [ArraySegment]

IndexAccess is shared by arrays and slices. This section owns the cases where the base type is `TypeArray`.

#### 12.3.4 Static Semantics

```text
ConstIndex(e) ⇔ ∃ n. Γ ⊢ ConstLen(e) ⇓ n

**(WF-Array)**

```text
T = TypeArray(T_0, e)    Γ ⊢ ConstLen(e) ⇓ n    Γ ⊢ T_0 wf
────────────────────────────────────────────────────────

```text
Γ ⊢ T wf

SegLen(ArrayElemSegment(_)) = 1

```text
SegLen(ArrayRepeatSegment(_, count)) = n where Γ ⊢ ConstLen(count) ⇓ n

**(T-Array-Literal-Segments)**

```text
∀ i,

```text
  (s_i = ArrayElemSegment(value_i) ⇒ Γ ⊢ value_i : T) ∧

```text
  (s_i = ArrayRepeatSegment(value_i, count_i) ⇒

```text
      Γ ⊢ value_i : T ∧
      BitcopyType(T) ∧

```text
      Γ ⊢ count_i : U_i ∧
      (IntType(U_i) ∨ U_i = TypePrim("usize")) ∧

```text
      Γ ⊢ ConstLen(count_i) ⇓ n_i)

```text
N = Σ_i SegLen(s_i)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ArrayExpr([s_1, …, s_k]) : TypeArray(T, Literal(IntLiteral(N)))

**(T-Index-Array)**

```text
Γ ⊢ e_1 : TypeArray(T, len)    Γ ⊢ e_2 : TypePrim("usize")    ConstIndex(e_2)    Γ ⊢ ConstLen(e_2) ⇓ i    Γ ⊢ ConstLen(len) ⇓ n    i < n    BitcopyType(T)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : T

**(T-Index-Array-Dynamic)**

```text
Γ ⊢ e_1 : TypeArray(T, len)    Γ ⊢ e_2 : TypePrim("usize")    ¬ ConstIndex(e_2)    InDynamicContext    BitcopyType(T)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : T

**(T-Index-Array-Perm)**

```text
Γ ⊢ e_1 : TypePerm(p, TypeArray(T, len))    Γ ⊢ e_2 : TypePrim("usize")    ConstIndex(e_2)    Γ ⊢ ConstLen(e_2) ⇓ i    Γ ⊢ ConstLen(len) ⇓ n    i < n    BitcopyType(TypePerm(p, T))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : TypePerm(p, T)

**(T-Index-Array-Perm-Dynamic)**

```text
Γ ⊢ e_1 : TypePerm(p, TypeArray(T, len))    Γ ⊢ e_2 : TypePrim("usize")    ¬ ConstIndex(e_2)    InDynamicContext    BitcopyType(TypePerm(p, T))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : TypePerm(p, T)

**(P-Index-Array)**

```text
Γ ⊢ e_1 :place TypeArray(T, len)    Γ ⊢ e_2 : TypePrim("usize")    ConstIndex(e_2)    Γ ⊢ ConstLen(e_2) ⇓ i    Γ ⊢ ConstLen(len) ⇓ n    i < n
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) :place T

**(P-Index-Array-Perm)**

```text
Γ ⊢ e_1 :place TypePerm(p, TypeArray(T, len))    Γ ⊢ e_2 : TypePrim("usize")    ConstIndex(e_2)    Γ ⊢ ConstLen(e_2) ⇓ i    Γ ⊢ ConstLen(len) ⇓ n    i < n
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) :place TypePerm(p, T)

**(P-Index-Array-Dynamic)**

```text
Γ ⊢ e_1 :place TypeArray(T, len)    Γ ⊢ e_2 : TypePrim("usize")    ¬ ConstIndex(e_2)    InDynamicContext
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) :place T

**(P-Index-Array-Perm-Dynamic)**

```text
Γ ⊢ e_1 :place TypePerm(p, TypeArray(T, len))    Γ ⊢ e_2 : TypePrim("usize")    ¬ ConstIndex(e_2)    InDynamicContext
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) :place TypePerm(p, T)

**(Index-Array-NonConst-Err)**

```text
Γ ⊢ e_1 : TypeArray(T, _)    Γ ⊢ e_2 : TypePrim("usize")    ¬ ConstIndex(e_2)    ¬ InDynamicContext    c = Code(Index-Array-NonConst-Err)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) ⇑ c

**(Index-Array-OOB-Err)**

```text
Γ ⊢ e_1 : TypeArray(T, len)    ConstIndex(e_2)    Γ ⊢ ConstLen(e_2) ⇓ i    Γ ⊢ ConstLen(len) ⇓ n    i ≥ n    c = Code(Index-Array-OOB-Err)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) ⇑ c

**(Index-Array-NonUsize)**

```text
Γ ⊢ e_1 : TypeArray(T, _)    Γ ⊢ e_2 : T_i    T_i ≠ TypePrim("usize")    c = Code(Index-Array-NonUsize)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) ⇑ c

#### 12.3.5 Dynamic Semantics

```text
ValueType([v_1, …, v_n]) = TypeArray(T, Literal(IntLiteral(n))) ⇔ ∀ i. ValueType(v_i) = T

Len([v_0, …, v_{n-1}]) = n

```text
IndexNum(v) = i ⇔ v = IntVal("usize", i)

```text
IndexValue([v_0, …, v_{n-1}], i) = v_i    (0 ≤ i < n)

```text
IndexValue(v, v_i) = v_e ⇔ IndexNum(v_i) = i ∧ IndexValue(v, i) = v_e

**(EvalSigma-Array)**

```text
Γ ⊢ EvalListSigma(es, σ) ⇓ (Val(vec_v), σ_1)
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(ArrayExpr(es), σ) ⇓ (Val([v_1, …, v_n]), σ_1)

**(EvalSigma-Array-Ctrl)**

```text
Γ ⊢ EvalListSigma(es, σ) ⇓ (Ctrl(κ), σ_1)
───────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(ArrayExpr(es), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-Index)**

```text
Γ ⊢ EvalSigma(base, σ) ⇓ (Val(v_b), σ_1)    Γ ⊢ EvalSigma(idx, σ_1) ⇓ (Val(v_i), σ_2)    IndexValue(v_b, v_i) = v_e
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IndexAccess(base, idx), σ) ⇓ (Val(v_e), σ_2)

**(EvalSigma-Index-OOB)**

```text
Γ ⊢ EvalSigma(base, σ) ⇓ (Val(v_b), σ_1)    Γ ⊢ EvalSigma(idx, σ_1) ⇓ (Val(v_i), σ_2)    IndexNum(v_i) = i    ¬ (0 ≤ i < Len(v_b))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IndexAccess(base, idx), σ) ⇓ (Ctrl(Panic), σ_2)

#### 12.3.6 Lowering

**(Size-Array)**

```text
Γ ⊢ ConstLen(e) ⇓ n    Γ ⊢ sizeof(T_0) = s
────────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(TypeArray(T_0, e)) = n × s

**(Align-Array)**

```text
Γ ⊢ alignof(T_0) = a
────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(TypeArray(T_0, e)) = a

**(Layout-Array)**

```text
Γ ⊢ sizeof(TypeArray(T_0, e)) = size    Γ ⊢ alignof(TypeArray(T_0, e)) = align
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(TypeArray(T_0, e)) ⇓ ⟨size, align⟩

```text
ArrayLen(e) = n ⇔ Γ ⊢ ConstLen(e) ⇓ n

```text
ValueBits(TypeArray(T, e), [v_0, …, v_{n-1}]) = bits ⇔ ArrayLen(e) = n ∧ s = sizeof(T) ∧ |bits| = n × s ∧ ∀ i. 0 ≤ i < n ⇒ (ValueBits(T, v_i) = b_i ∧ bits[i × s .. i × s + |b_i|) = b_i)

**(Lower-Expr-Array)**

```text
Γ ⊢ LowerArraySegments(segs) ⇓ ⟨IR, vec_v⟩
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(ArrayExpr(segs)) ⇓ ⟨IR, [v_1, …, v_n]⟩

#### 12.3.7 Diagnostics

Diagnostics are defined for non-constant array indexing outside `[[dynamic]]` scope, out-of-bounds constant indices, and non-`usize` array indices. Runtime out-of-bounds behavior for dynamic indices is defined by the panic behavior of `EvalSigma-Index-OOB`.

### 12.4 Slices

#### 12.4.1 Syntax

```text
```

slice_type  ::= "[" type "]"
slice_expr  ::= postfix_expr "[" expr "]"
coercion    ::= array_expr_as_slice
```

Array-to-slice coercion is semantic rather than surface-syntactic.

#### 12.4.2 Parsing

**(Parse-Slice-Type)**

```text
IsPunc(Tok(P), "[")    Γ ⊢ ParseType(Advance(P)) ⇓ (P_1, t)    IsPunc(Tok(P_1), "]")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (Advance(P_1), TypeSlice(t))

`IndexAccess(base, idx)` is parsed by `Postfix-Index` in §12.3.2. This section owns the cases where the base type is `TypeSlice`.

#### 12.4.3 AST Representation / Form

```text
TypeSlice = ⟨elem⟩ where elem ∈ Type

`IndexAccess(base, idx)` denotes either direct slice indexing or slice-producing range selection when the base type is `TypeSlice`.

#### 12.4.4 Static Semantics

```text
RangeIndexType(T_r) ⇔ T_r = TypeRange(TypePrim("usize")) ∨ T_r = TypeRangeInclusive(TypePrim("usize")) ∨ T_r = TypeRangeFrom(TypePrim("usize")) ∨ T_r = TypeRangeTo(TypePrim("usize")) ∨ T_r = TypeRangeToInclusive(TypePrim("usize")) ∨ T_r = TypeRangeFull

**(WF-Slice)**

```text
T = TypeSlice(T_0)    Γ ⊢ T_0 wf
────────────────────────────────────────

```text
Γ ⊢ T wf

**(T-Index-Slice)**

```text
Γ ⊢ e_1 : TypeSlice(T)    Γ ⊢ e_2 : TypePrim("usize")    BitcopyType(T)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : T

**(T-Index-Slice-Perm)**

```text
Γ ⊢ e_1 : TypePerm(p, TypeSlice(T))    Γ ⊢ e_2 : TypePrim("usize")    BitcopyType(TypePerm(p, T))
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : TypePerm(p, T)

**(T-Slice-From-Array)**

```text
Γ ⊢ e_1 : TypeArray(T, n)    Γ; R; L ⊢ e_2 : Range    RangeIndexType(ExprType(e_2))    BitcopyType(TypeSlice(T))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : TypeSlice(T)

**(T-Slice-From-Array-Perm)**

```text
Γ ⊢ e_1 : TypePerm(p, TypeArray(T, n))    Γ; R; L ⊢ e_2 : Range    RangeIndexType(ExprType(e_2))    BitcopyType(TypePerm(p, TypeSlice(T)))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : TypePerm(p, TypeSlice(T))

**(T-Slice-From-Slice)**

```text
Γ ⊢ e_1 : TypeSlice(T)    Γ; R; L ⊢ e_2 : Range    RangeIndexType(ExprType(e_2))    BitcopyType(TypeSlice(T))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : TypeSlice(T)

**(T-Slice-From-Slice-Perm)**

```text
Γ ⊢ e_1 : TypePerm(p, TypeSlice(T))    Γ; R; L ⊢ e_2 : Range    RangeIndexType(ExprType(e_2))    BitcopyType(TypePerm(p, TypeSlice(T)))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : TypePerm(p, TypeSlice(T))

**(P-Index-Slice)**

```text
Γ ⊢ e_1 :place TypeSlice(T)    Γ ⊢ e_2 : TypePrim("usize")
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) :place T

**(P-Index-Slice-Perm)**

```text
Γ ⊢ e_1 :place TypePerm(p, TypeSlice(T))    Γ ⊢ e_2 : TypePrim("usize")
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) :place TypePerm(p, T)

**(P-Slice-From-Array)**

```text
Γ ⊢ e_1 :place TypeArray(T, n)    Γ; R; L ⊢ e_2 : Range    RangeIndexType(ExprType(e_2))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) :place TypeSlice(T)

**(P-Slice-From-Array-Perm)**

```text
Γ ⊢ e_1 :place TypePerm(p, TypeArray(T, n))    Γ; R; L ⊢ e_2 : Range    RangeIndexType(ExprType(e_2))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) :place TypePerm(p, TypeSlice(T))

**(P-Slice-From-Slice)**

```text
Γ ⊢ e_1 :place TypeSlice(T)    Γ; R; L ⊢ e_2 : Range    RangeIndexType(ExprType(e_2))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) :place TypeSlice(T)

**(P-Slice-From-Slice-Perm)**

```text
Γ ⊢ e_1 :place TypePerm(p, TypeSlice(T))    Γ; R; L ⊢ e_2 : Range    RangeIndexType(ExprType(e_2))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) :place TypePerm(p, TypeSlice(T))

**(Coerce-Array-Slice)**

```text
Γ ⊢ e : TypePerm(p, TypeArray(T, n))
──────────────────────────────────────────────────────────────

```text
Γ ⊢ e : TypePerm(p, TypeSlice(T))

**(Index-NonIndexable)**

```text
Γ ⊢ e_1 : T    StripPerm(T) ∉ {TypeArray(_, _), TypeSlice(_)}    c = Code(Index-NonIndexable)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) ⇑ c

#### 12.4.5 Dynamic Semantics

```text
ValueType(SliceValue(v, r)) = TypeSlice(T) ⇔ ValueType(v) = TypeArray(T, _) ∨ ValueType(v) = TypeSlice(T)

Len(SliceValue(v, r)) = end - start    (SliceBounds(r, Len(v)) = (start, end))

```text
IndexValue(SliceValue(v, r), i) = IndexValue(v, start + i)    (SliceBounds(r, Len(v)) = (start, end) ∧ 0 ≤ i < end - start)

**(EvalSigma-Index-Range)**

```text
Γ ⊢ EvalSigma(base, σ) ⇓ (Val(v_b), σ_1)    Γ ⊢ EvalSigma(idx, σ_1) ⇓ (Val(v_r), σ_2)    SliceValue(v_b, v_r) = v_s
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IndexAccess(base, idx), σ) ⇓ (Val(v_s), σ_2)

**(EvalSigma-Index-Range-OOB)**

```text
Γ ⊢ EvalSigma(base, σ) ⇓ (Val(v_b), σ_1)    Γ ⊢ EvalSigma(idx, σ_1) ⇓ (Val(v_r), σ_2)    SliceBounds(v_r, Len(v_b)) = ⊥
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IndexAccess(base, idx), σ) ⇓ (Ctrl(Panic), σ_2)

#### 12.4.6 Lowering

**(Size-Slice)**
────────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = 2 × PtrSize

**(Align-Slice)**
──────────────────────────────────────────

```text
Γ ⊢ alignof(T) = PtrAlign

**(Layout-Slice)**
────────────────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨2 × PtrSize, PtrAlign⟩

```text
ValueBits(TypeSlice(T), SliceValue(v, r)) = bits ⇔ SliceBounds(r, Len(v)) = (start, end) ∧ n = end - start ∧ ∃ addr. ValueBits(TypeRawPtr(`imm`, T), RawPtr(`imm`, addr)) = b_ptr ∧ ValueBits(TypePrim("usize"), IntVal("usize", n)) = b_len ∧ bits = b_ptr ++ b_len

```text
IndexUpdate(SliceValue(v_b, r), i, v_e) = SliceValue(v_b', r)    (SliceBounds(r, Len(v_b)) = (start, end) ∧ 0 ≤ i < end - start ∧ IndexUpdate(v_b, start + i, v_e) = v_b')

#### 12.4.7 Diagnostics

**(Index-Slice-NonUsize)**

```text
Γ ⊢ e_1 : T_b    StripPerm(T_b) = TypeSlice(T)    Γ ⊢ e_2 : T_i    T_i ≠ TypePrim("usize")    c = Code(Index-Slice-NonUsize)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) ⇑ c

Direct slice indexing follows the same scalar-indexing model as array indexing. Diagnostics are defined for non-`usize` slice indices and non-indexable bases. Runtime slice-bounds failures panic through `EvalSigma-Index-OOB` for scalar indexing and `EvalSigma-Index-Range-OOB` for slicing.

### 12.5 Ranges

#### 12.5.1 Syntax

```text
```

range_expr      ::= ".."
                  | ".." expr
                  | "..=" expr
                  | expr ".."
                  | expr ".." expr
                  | expr "..=" expr
range_type_name ::= "Range" | "RangeInclusive" | "RangeFrom" | "RangeTo" | "RangeToInclusive" | "RangeFull"
```

`Range<T>`, `RangeInclusive<T>`, `RangeFrom<T>`, `RangeTo<T>`, and `RangeToInclusive<T>` use the ordinary `generic_type_use` syntax of §14.2.1. `RangeFull` uses the ordinary nominal type-path syntax. No range-specific type parser is introduced.

#### 12.5.2 Parsing

**(Parse-Range-To)**

```text
IsOp(Tok(P), "..")    Γ ⊢ ParseAdd(Advance(P)) ⇓ (P_1, e)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRange(P) ⇓ (P_1, Range(`To`, ⊥, e))

**(Parse-Range-ToInc)**

```text
IsOp(Tok(P), "..=")    Γ ⊢ ParseAdd(Advance(P)) ⇓ (P_1, e)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRange(P) ⇓ (P_1, Range(`ToInclusive`, ⊥, e))

**(Parse-Range-Full)**

```text
IsOp(Tok(P), "..")    Tok(Advance(P)) ∈ RangeStop
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRange(P) ⇓ (Advance(P), Range(`Full`, ⊥, ⊥))

**(Parse-Range-Lhs)**

```text
Γ ⊢ ParseAdd(P) ⇓ (P_1, e_0)    Γ ⊢ ParseRangeTail(P_1, e_0) ⇓ (P_2, e)
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRange(P) ⇓ (P_2, e)

**(Parse-RangeTail-None)**

```text
Tok(P) ∉ {Operator(".."), Operator("..=")}
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRangeTail(P, e_0) ⇓ (P, e_0)

**(Parse-RangeTail-From)**

```text
IsOp(Tok(P), "..")    Tok(Advance(P)) ∈ RangeStop
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRangeTail(P, e_0) ⇓ (Advance(P), Range(`From`, e_0, ⊥))

**(Parse-RangeTail-Exclusive)**

```text
IsOp(Tok(P), "..")    Γ ⊢ ParseAdd(Advance(P)) ⇓ (P_1, e_1)
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRangeTail(P, e_0) ⇓ (P_1, Range(`Exclusive`, e_0, e_1))

**(Parse-RangeTail-Inclusive)**

```text
IsOp(Tok(P), "..=")    Γ ⊢ ParseAdd(Advance(P)) ⇓ (P_1, e_1)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRangeTail(P, e_0) ⇓ (P_1, Range(`Inclusive`, e_0, e_1))

Range surface types are parsed by the ordinary type parser:

- `Range<T>` elaborates to `TypeRange(T)`
- `RangeInclusive<T>` elaborates to `TypeRangeInclusive(T)`
- `RangeFrom<T>` elaborates to `TypeRangeFrom(T)`
- `RangeTo<T>` elaborates to `TypeRangeTo(T)`
- `RangeToInclusive<T>` elaborates to `TypeRangeToInclusive(T)`
- `RangeFull` elaborates to `TypeRangeFull`

#### 12.5.3 AST Representation / Form

RangeType = {TypeRange(base), TypeRangeInclusive(base), TypeRangeFrom(base), TypeRangeTo(base), TypeRangeToInclusive(base), TypeRangeFull}

```text
RangeExpr = Range(kind, lo_opt, hi_opt) where kind ∈ {`Exclusive`, `Inclusive`, `From`, `To`, `ToInclusive`, `Full`}

```text
IsRangeType(T) ⇔ T = TypeRange(_) ∨ T = TypeRangeInclusive(_) ∨ T = TypeRangeFrom(_) ∨ T = TypeRangeTo(_) ∨ T = TypeRangeToInclusive(_) ∨ T = TypeRangeFull

#### 12.5.4 Static Semantics

```text
Γ; R; L ⊢ Range(`Full`, ⊥, ⊥) : Range ⇒ ExprType(Range(`Full`, ⊥, ⊥)) = TypeRangeFull

```text
Γ; R; L ⊢ Range(`To`, ⊥, e) : Range ⇒ ExprType(Range(`To`, ⊥, e)) = TypeRangeTo(ExprType(e))

```text
Γ; R; L ⊢ Range(`ToInclusive`, ⊥, e) : Range ⇒ ExprType(Range(`ToInclusive`, ⊥, e)) = TypeRangeToInclusive(ExprType(e))

```text
Γ; R; L ⊢ Range(`From`, e, ⊥) : Range ⇒ ExprType(Range(`From`, e, ⊥)) = TypeRangeFrom(ExprType(e))

```text
Γ; R; L ⊢ Range(`Exclusive`, e_1, e_2) : Range ⇒ ExprType(Range(`Exclusive`, e_1, e_2)) = TypeRange(ExprType(e_1))

```text
Γ; R; L ⊢ Range(`Inclusive`, e_1, e_2) : Range ⇒ ExprType(Range(`Inclusive`, e_1, e_2)) = TypeRangeInclusive(ExprType(e_1))

**(T-Range-Lift)**

```text
Γ; R; L ⊢ r : Range    ExprType(r) = T
────────────────────────────────────────────────

```text
Γ; R; L ⊢ r : T

**(Range-Full)**
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Range(`Full`, ⊥, ⊥) : Range

**(Range-To)**

```text
Γ; R; L ⊢ e : T
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Range(`To`, ⊥, e) : Range

**(Range-ToInclusive)**

```text
Γ; R; L ⊢ e : T
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Range(`ToInclusive`, ⊥, e) : Range

**(Range-From)**

```text
Γ; R; L ⊢ e : T
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Range(`From`, e, ⊥) : Range

**(Range-Exclusive)**

```text
Γ; R; L ⊢ e_1 : T    Γ; R; L ⊢ e_2 : T
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Range(`Exclusive`, e_1, e_2) : Range

**(Range-Inclusive)**

```text
Γ; R; L ⊢ e_1 : T    Γ; R; L ⊢ e_2 : T
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Range(`Inclusive`, e_1, e_2) : Range

Range-pattern semantics are defined by §17.4.

#### 12.5.5 Dynamic Semantics

```text
ValueType(RangeVal(`Exclusive`, lo, hi)) = TypeRange(T) ⇔ ValueType(lo) = T ∧ ValueType(hi) = T

```text
ValueType(RangeVal(`Inclusive`, lo, hi)) = TypeRangeInclusive(T) ⇔ ValueType(lo) = T ∧ ValueType(hi) = T

```text
ValueType(RangeVal(`From`, lo, ⊥)) = TypeRangeFrom(T) ⇔ ValueType(lo) = T

```text
ValueType(RangeVal(`To`, ⊥, hi)) = TypeRangeTo(T) ⇔ ValueType(hi) = T

```text
ValueType(RangeVal(`ToInclusive`, ⊥, hi)) = TypeRangeToInclusive(T) ⇔ ValueType(hi) = T

```text
ValueType(RangeVal(`Full`, ⊥, ⊥)) = TypeRangeFull

**(EvalSigma-Range)**

```text
Γ ⊢ EvalOptSigma(lo_opt, σ_0) ⇓ (Val(v_lo), σ_1)    Γ ⊢ EvalOptSigma(hi_opt, σ_1) ⇓ (Val(v_hi), σ_2)    r = RangeVal(kind, v_lo, v_hi)
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Range(kind, lo_opt, hi_opt), σ_0) ⇓ (Val(r), σ_2)

**(EvalSigma-Range-Ctrl)**

```text
Γ ⊢ EvalOptSigma(lo_opt, σ_0) ⇓ (Ctrl(κ), σ_1)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Range(kind, lo_opt, hi_opt), σ_0) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-Range-Ctrl-Hi)**

```text
Γ ⊢ EvalOptSigma(lo_opt, σ_0) ⇓ (Val(v_lo), σ_1)    Γ ⊢ EvalOptSigma(hi_opt, σ_1) ⇓ (Ctrl(κ), σ_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Range(kind, lo_opt, hi_opt), σ_0) ⇓ (Ctrl(κ), σ_2)

```text
Inc(v) = v' ⇔ v = IntVal(t, x) ∧ x' = x + 1 ∧ InRange(x', t) ∧ v' = IntVal(t, x')

```text
SliceBoundsRaw(RangeVal(`Exclusive`, s, e), L) = (start, end) ⇔ IndexNum(s) = start ∧ IndexNum(e) = end

```text
SliceBoundsRaw(RangeVal(`Inclusive`, s, e), L) = (start, end) ⇔ IndexNum(s) = start ∧ Inc(e) = e' ∧ IndexNum(e') = end

```text
SliceBoundsRaw(RangeVal(`From`, s, ⊥), L) = (start, L) ⇔ IndexNum(s) = start

```text
SliceBoundsRaw(RangeVal(`To`, ⊥, e), L) = (0, end) ⇔ IndexNum(e) = end

```text
SliceBoundsRaw(RangeVal(`ToInclusive`, ⊥, e), L) = (0, end) ⇔ Inc(e) = e' ∧ IndexNum(e') = end

```text
SliceBoundsRaw(RangeVal(`Full`, ⊥, ⊥), L) = (0, L)

```text
SliceBounds(r, L) = (start, end) ⇔ SliceBoundsRaw(r, L) = (start, end) ∧ 0 ≤ start ≤ end ≤ L

```text
SliceBounds(r, L) = ⊥ ⇔ SliceBoundsRaw(r, L) = ⊥ ∨ (∃ start, end. SliceBoundsRaw(r, L) = (start, end) ∧ ¬ (0 ≤ start ≤ end ≤ L))

#### 12.5.6 Lowering

ChecksJudg = {LowerRangeExpr, CheckIndex, CheckRange, LowerTransmute, LowerRawDeref}

```text
ValueBits(TypeRange(T), r) = bits ⇔ r = RangeVal(`Exclusive`, v_lo, v_hi) ∧ TupleLayout([T, T]) ⇓ ⟨size, _, offsets⟩ ∧ StructBits([T, T], [v_lo, v_hi], offsets, size) = bits

```text
ValueBits(TypeRangeInclusive(T), r) = bits ⇔ r = RangeVal(`Inclusive`, v_lo, v_hi) ∧ TupleLayout([T, T]) ⇓ ⟨size, _, offsets⟩ ∧ StructBits([T, T], [v_lo, v_hi], offsets, size) = bits

```text
ValueBits(TypeRangeFrom(T), r) = bits ⇔ r = RangeVal(`From`, v_lo, ⊥) ∧ TupleLayout([T]) ⇓ ⟨size, _, offsets⟩ ∧ StructBits([T], [v_lo], offsets, size) = bits

```text
ValueBits(TypeRangeTo(T), r) = bits ⇔ r = RangeVal(`To`, ⊥, v_hi) ∧ TupleLayout([T]) ⇓ ⟨size, _, offsets⟩ ∧ StructBits([T], [v_hi], offsets, size) = bits

```text
ValueBits(TypeRangeToInclusive(T), r) = bits ⇔ r = RangeVal(`ToInclusive`, ⊥, v_hi) ∧ TupleLayout([T]) ⇓ ⟨size, _, offsets⟩ ∧ StructBits([T], [v_hi], offsets, size) = bits

```text
ValueBits(TypeRangeFull, r) = bits ⇔ r = RangeVal(`Full`, ⊥, ⊥) ∧ bits = []

**(Lower-Range-Full)**
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerRangeExpr(Range(`Full`, ⊥, ⊥)) ⇓ ⟨ε, RangeVal(`Full`, ⊥, ⊥)⟩

**(Lower-Range-To)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerRangeExpr(Range(`To`, ⊥, e)) ⇓ ⟨IR_e, RangeVal(`To`, ⊥, v)⟩

**(Lower-Range-ToInclusive)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerRangeExpr(Range(`ToInclusive`, ⊥, e)) ⇓ ⟨IR_e, RangeVal(`ToInclusive`, ⊥, v)⟩

**(Lower-Range-From)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerRangeExpr(Range(`From`, e, ⊥)) ⇓ ⟨IR_e, RangeVal(`From`, v, ⊥)⟩

**(Lower-Range-Inclusive)**

```text
Γ ⊢ LowerExpr(e_1) ⇓ ⟨IR_1, v_1⟩    Γ ⊢ LowerExpr(e_2) ⇓ ⟨IR_2, v_2⟩
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerRangeExpr(Range(`Inclusive`, e_1, e_2)) ⇓ ⟨SeqIR(IR_1, IR_2), RangeVal(`Inclusive`, v_1, v_2)⟩

**(Lower-Range-Exclusive)**

```text
Γ ⊢ LowerExpr(e_1) ⇓ ⟨IR_1, v_1⟩    Γ ⊢ LowerExpr(e_2) ⇓ ⟨IR_2, v_2⟩
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerRangeExpr(Range(`Exclusive`, e_1, e_2)) ⇓ ⟨SeqIR(IR_1, IR_2), RangeVal(`Exclusive`, v_1, v_2)⟩

**(Size-Range)**

```text
TupleLayout([T, T]) ⇓ ⟨size, _, _⟩
────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(TypeRange(T)) = size

**(Align-Range)**

```text
TupleLayout([T, T]) ⇓ ⟨_, align, _⟩
─────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(TypeRange(T)) = align

**(Layout-Range)**

```text
TupleLayout([T, T]) ⇓ ⟨size, align, _⟩
─────────────────────────────────────────────────────────

```text
Γ ⊢ layout(TypeRange(T)) ⇓ ⟨size, align⟩

**(Size-RangeInclusive)**

```text
TupleLayout([T, T]) ⇓ ⟨size, _, _⟩
──────────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(TypeRangeInclusive(T)) = size

**(Align-RangeInclusive)**

```text
TupleLayout([T, T]) ⇓ ⟨_, align, _⟩
───────────────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(TypeRangeInclusive(T)) = align

**(Layout-RangeInclusive)**

```text
TupleLayout([T, T]) ⇓ ⟨size, align, _⟩
───────────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(TypeRangeInclusive(T)) ⇓ ⟨size, align⟩

**(Size-RangeFrom)**

```text
Γ ⊢ sizeof(T) = size
────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(TypeRangeFrom(T)) = size

**(Align-RangeFrom)**

```text
Γ ⊢ alignof(T) = align
─────────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(TypeRangeFrom(T)) = align

**(Layout-RangeFrom)**

```text
Γ ⊢ sizeof(TypeRangeFrom(T)) = size    Γ ⊢ alignof(TypeRangeFrom(T)) = align
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(TypeRangeFrom(T)) ⇓ ⟨size, align⟩

**(Size-RangeTo)**

```text
Γ ⊢ sizeof(T) = size
──────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(TypeRangeTo(T)) = size

**(Align-RangeTo)**

```text
Γ ⊢ alignof(T) = align
───────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(TypeRangeTo(T)) = align

**(Layout-RangeTo)**

```text
Γ ⊢ sizeof(TypeRangeTo(T)) = size    Γ ⊢ alignof(TypeRangeTo(T)) = align
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(TypeRangeTo(T)) ⇓ ⟨size, align⟩

**(Size-RangeToInclusive)**

```text
Γ ⊢ sizeof(T) = size
────────────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(TypeRangeToInclusive(T)) = size

**(Align-RangeToInclusive)**

```text
Γ ⊢ alignof(T) = align
─────────────────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(TypeRangeToInclusive(T)) = align

**(Layout-RangeToInclusive)**

```text
Γ ⊢ sizeof(TypeRangeToInclusive(T)) = size    Γ ⊢ alignof(TypeRangeToInclusive(T)) = align
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(TypeRangeToInclusive(T)) ⇓ ⟨size, align⟩

**(Size-RangeFull)**
──────────────────────────────────────────────

```text
Γ ⊢ sizeof(TypeRangeFull) = 0

**(Align-RangeFull)**
────────────────────────────────────────────────

```text
Γ ⊢ alignof(TypeRangeFull) = 1

**(Layout-RangeFull)**
────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(TypeRangeFull) ⇓ ⟨0, 1⟩

#### 12.5.7 Diagnostics

Diagnostics are defined for non-constant and empty range patterns in §17.4. Slice-bounds failures induced by ranges panic at runtime when `SliceBounds` is undefined.

### 12.6 Records

#### 12.6.1 Syntax

```text
```

record_decl     ::= attribute_list? visibility? "record" identifier generic_params? implements_clause? predicate_clause? record_body invariant_clause?
record_body     ::= "{" record_member* "}"
record_field    ::= attribute_list? visibility? key_boundary? identifier ":" type record_field_init_opt
record_literal  ::= identifier "{" field_init_list "}"
default_record  ::= identifier "(" ")"
```

#### 12.6.2 Parsing

**(Parse-Record)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `record`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseGenericParamsOpt(P_2) ⇓ (P_3, gen_params_opt)    Γ ⊢ ParseImplementsOpt(P_3) ⇓ (P_4, impls)    Γ ⊢ ParsePredicateClauseOpt(P_4) ⇓ (P_5, predicate_clause_opt)    Γ ⊢ ParseRecordBody(P_5) ⇓ (P_6, members)    Γ ⊢ ParseInvariantOpt(P_6) ⇓ (P_7, invariant_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (P_7, ⟨RecordDecl, attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, members, invariant_opt, SpanBetween(P, P_7), []⟩)

**(Parse-RecordBody)**

```text
IsPunc(Tok(P), "{")    Γ ⊢ ParseRecordMemberList(Advance(P)) ⇓ (P_1, members)    IsPunc(Tok(P_1), "}")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRecordBody(P) ⇓ (Advance(P_1), members)

**(Parse-RecordMemberList-End)**
IsPunc(Tok(P), "}")
────────────────────────────────────────────

```text
Γ ⊢ ParseRecordMemberList(P) ⇓ (P, [])

**(Parse-RecordMemberList-Cons)**

```text
Γ ⊢ ParseRecordMember(P) ⇓ (P_1, m)    Γ ⊢ ParseRecordMemberSep(P_1) ⇓ P_2    Γ ⊢ ParseRecordMemberList(P_2) ⇓ (P_3, ms)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRecordMemberList(P) ⇓ (P_3, [m] ++ ms)

**(Parse-RecordMember-Method)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `procedure`)    Γ ⊢ ParseMethodDefAfterVis(P_1, vis, attrs_opt) ⇓ (P_2, m)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRecordMember(P) ⇓ (P_2, m)

**(Parse-RecordMember-AssociatedType)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `type`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseAssocTypeDefaultOpt(P_2) ⇓ (P_3, default_type_opt)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRecordMember(P) ⇓ (P_3, ⟨AssociatedTypeDecl, attrs_opt, vis, name, default_type_opt, SpanBetween(P, P_3), []⟩)

**(Parse-RecordMember-Field)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    ¬ IsKw(Tok(P_1), `procedure`) ∧ ¬ IsKw(Tok(P_1), `type`)    Γ ⊢ ParseRecordFieldDeclAfterVis(P_1, vis, attrs_opt) ⇓ (P_2, f)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRecordMember(P) ⇓ (P_2, f)

**(Parse-RecordFieldDeclAfterVis)**

```text
Γ ⊢ ParseKeyBoundaryOpt(P) ⇓ (P_0, boundary)    Γ ⊢ ParseIdent(P_0) ⇓ (P_1, name)    IsPunc(Tok(P_1), ":")    Γ ⊢ ParseType(Advance(P_1)) ⇓ (P_2, ty)    Γ ⊢ ParseRecordFieldInitOpt(P_2) ⇓ (P_3, init_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRecordFieldDeclAfterVis(P, vis, attrs_opt) ⇓ (P_3, ⟨FieldDecl, attrs_opt, vis, boundary, name, ty, init_opt, SpanBetween(P, P_3), ⊥⟩)

**(Parse-RecordFieldInitOpt-None)**
¬ IsOp(Tok(P), "=")
────────────────────────────────────────────────

```text
Γ ⊢ ParseRecordFieldInitOpt(P) ⇓ (P, ⊥)

**(Parse-RecordFieldInitOpt-Yes)**

```text
IsOp(Tok(P), "=")    Γ ⊢ ParseExpr(Advance(P)) ⇓ (P_1, e)
────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRecordFieldInitOpt(P) ⇓ (P_1, e)

**(Parse-Record-Literal)**

```text
Γ ⊢ ParseTypePath(P) ⇓ (P_1, path)    |path| = 1    IsPunc(Tok(P_1), "{")    Γ ⊢ ParseFieldInitList(Advance(P_1)) ⇓ (P_2, fields)    fields ≠ []    IsPunc(Tok(P_2), "}")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_2), RecordExpr(TypePath(path), fields))

#### 12.6.3 AST Representation / Form

```text
RecordDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, implements, members, invariant_opt, span, doc⟩

```text
RecordDecl.implements ∈ [ClassPath]

```text
RecordMember ∈ {

```text
  FieldDecl = ⟨attrs_opt, vis, boundary, name, type, init_opt, span, doc_opt⟩,

```text
  MethodDecl = ⟨attrs_opt, vis, override, name, gen_params_opt, receiver, params, return_type_opt, contract_opt, body, span, doc_opt⟩,

```text
  AssociatedTypeDecl = ⟨attrs_opt, vis, name, default_type_opt, span, doc_opt⟩
}

```text
RecordExpr = ⟨type_ref, fields⟩ where type_ref ∈ {TypePath(path), ModalStateRef(modal_ref, state)}

```text
Fields(R) = [ f | f ∈ R.members ∧ ∃ attrs, vis, boundary, name, ty, init, span, doc. f = FieldDecl(attrs, vis, boundary, name, ty, init, span, doc) ]

```text
Methods(R) = [ m | m ∈ R.members ∧ ∃ attrs, vis, override, name, gen_params, recv, params, ret, contract, body, span, doc. m = MethodDecl(attrs, vis, override, name, gen_params, recv, params, ret, contract, body, span, doc) ]

BuiltinRecord = {`RegionOptions`, `DirEntry`, `Context`, `System`}

```text
RecordPath(R) = [R.name]    if R.name ∈ BuiltinRecord
RecordPath(R) = FullPath(ModuleOf(R), R.name)    otherwise

#### 12.6.4 Static Semantics

**(Bind-Record)**
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(RecordDecl(_, _, name, _, _, _, _, _, _, _), p) ⇓ [(name, ⟨Type, p, ⊥, Decl⟩)]

**(Resolve-RecordPath)**

```text
Γ ⊢ ResolveTypePath(path ++ [name]) ⇓ p    RecordDecl(p) = R
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveRecordPath(path, name) ⇓ p

**(ResolveQual-Name-Record)**

```text
Γ ⊢ ResolveRecordPath(path, name) ⇓ p    SplitLast(p) = (mp, name')
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveQualifiedForm(QualifiedName(path, name)) ⇓ Path(mp, name')

**(ResolveQual-Apply-RecordLit)**

```text
Γ ⊢ ResolveFieldInits(fields) ⇓ fields'    Γ ⊢ ResolveRecordPath(path, name) ⇓ p
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveQualifiedForm(QualifiedApply(path, name, Brace(fields))) ⇓ RecordExpr(TypePath(p), fields')

**(ResolveItem-Record)**

```text
R = RecordDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, members, invariant_opt, span, doc)    S_gen = TypeParamBindings(gen_params_opt)    Γ_g = [S_gen, S_module, S_universe]    Γ_g ⊢ ResolveGenericParamsOpt(gen_params_opt) ⇓ gen_params_opt'    Γ_g ⊢ ResolvePredicateClauseOpt(predicate_clause_opt) ⇓ predicate_clause_opt'    Γ_g ⊢ ResolveClassPathList(impls) ⇓ impls'    Γ_g ⊢ ResolveRecordMemberList(R, members) ⇓ members'    Γ_g ⊢ ResolveInvariantOpt(invariant_opt) ⇓ invariant_opt'
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveItem(R) ⇓ RecordDecl(attrs_opt, vis, name, gen_params_opt', predicate_clause_opt', impls', members', invariant_opt', span, doc)

```text
InitOk(f) ⇔ f = FieldDecl(attrs_opt, vis, boundary, name, T_f, init_opt, span, doc) ∧ (init_opt = ⊥) ∨ (init_opt = e ∧ Γ; ⊥; ⊥ ⊢ e : T ∧ Γ ⊢ T <: T_f)
VisRank(`public`) = 3    VisRank(`internal`) = 2    VisRank(`private`) = 1

```text
FieldVisOk(R) ⇔ ∀ f ∈ Fields(R). VisRank(f.vis) ≤ VisRank(R.vis)

**(WF-Record)**

```text
∀ f ∈ Fields(R), InitOk(f)    ∀ f_i ≠ f_j, f_i.name ≠ f_j.name
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ R record wf

**(WF-Record-DupField)**

```text
∃ f_i ≠ f_j. f_i.name = f_j.name    c = Code(WF-Record-DupField)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ R record wf ⇑ c

**(WF-RecordDecl)**

```text
R = RecordDecl(_, _, _, gen_params_opt, predicate_clause_opt, _, _, _, _, _)    params_gen = TypeParamsOpt(gen_params_opt)    params_gen = [P_1, …, P_n]    Γ ⊢ ⟨P_1; …; P_n⟩ wf    Γ_g = BindTypeParams(Γ, params_gen)    Γ_g; params_gen ⊢ predicate_clause_opt wf    ∀ f ∈ Fields(R), Γ_g ⊢ f.type wf    FieldVisOk(R)    Γ_g ⊢ R record wf    Γ_g ⊢ Methods(R) : ok    Γ_g ⊢ TypePath(RecordPath(R)) : ImplementsOk
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ R record : ok

**(FieldVisOk-Err)**
R = RecordDecl(_, _, _, _, _, _, _, _, _, _)    ¬ FieldVisOk(R)    c = Code(FieldVisOk-Err)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ R ⇑ c

```text
DefaultConstructible(R) ⇔ ∀ f ∈ Fields(R). f.init_opt ≠ ⊥

```text
RecordCallee(callee) = R ⇔ (callee = Identifier(name) ∨ callee = Path(path, name)) ∧ Γ ⊢ ResolveTypeName(name) ⇓ ent ∧ ent.origin_opt = mp ∧ name' = (ent.target_opt if present, else name) ∧ RecordDecl(FullPath(PathOfModule(mp), name')) = R

**(T-Record-Default)**

```text
RecordCallee(callee) = R    Γ ⊢ R record wf    DefaultConstructible(R)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Call(callee, []) : TypePath(RecordPath(R))

```text
FieldNames(R) = [ f.name | f ∈ Fields(R) ]

```text
FieldInitNames(fields) = [ f | ⟨f, _⟩ ∈ fields ]

```text
Set(xs) = { x | x ∈ xs }
FieldNameSet(R) = Set(FieldNames(R))
FieldInitSet(fields) = Set(FieldInitNames(fields))

```text
FieldType(R, f) = T_f ⇔ ∃ attrs_opt, vis, boundary, init_opt, span, doc_opt. FieldDecl(attrs_opt, vis, boundary, f, T_f, init_opt, span, doc_opt) ∈ Fields(R)

```text
FieldVis(R, f) = vis ⇔ ∃ attrs_opt, boundary, T_f, init_opt, span, doc_opt. FieldDecl(attrs_opt, vis, boundary, f, T_f, init_opt, span, doc_opt) ∈ Fields(R)

```text
FieldVisible(m, R, f) ⇔ FieldVis(R, f) ∈ {`public`, `internal`} ∨ (FieldVis(R, f) = `private` ∧ ModuleOfPath(RecordPath(R)) = m)

**(T-Record-Literal)**

```text
RecordDecl(p) = R    Distinct(FieldInitNames(fields))    FieldInitSet(fields) = FieldNameSet(R)    ∀ ⟨f, e⟩ ∈ fields, FieldType(R, f) = T_f ∧ FieldVisible(m, R, f) ∧ Γ; R; L ⊢ e ⇐ T_f ⊣ ∅
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ RecordExpr(TypePath(p), fields) : TypePath(p)

#### 12.6.5 Dynamic Semantics

ValueType(RecordValue(TypePath(p), fs)) = TypePath(p)

**(EvalSigma-Record)**

```text
Γ ⊢ EvalFieldInitsSigma(fields, σ) ⇓ (Val(vec_f), σ_1)
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(RecordExpr(tr, fields), σ) ⇓ (Val(RecordValue(tr, vec_f)), σ_1)

**(EvalSigma-Record-Ctrl)**

```text
Γ ⊢ EvalFieldInitsSigma(fields, σ) ⇓ (Ctrl(κ), σ_1)
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(RecordExpr(tr, fields), σ) ⇓ (Ctrl(κ), σ_1)

```text
RecordDefaultInits(p) = [⟨f_1, e_1⟩, …, ⟨f_n, e_n⟩] ⇔ RecordDecl(p) = R ∧ Fields(R) = [FieldDecl(attrs_1, vis_1, boundary_1, f_1, T_1, e_1, span_1, doc_1), …, FieldDecl(attrs_n, vis_n, boundary_n, f_n, T_n, e_n, span_n, doc_n)] ∧ ∀ i. e_i ≠ ⊥

**(ApplyRecordCtorSigma)**

```text
RecordDefaultInits(p) = fields    Γ ⊢ EvalFieldInitsSigma(fields, σ) ⇓ (Val(vec_f), σ_1)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyRecordCtorSigma(p, σ) ⇓ (Val(RecordValue(TypePath(p), vec_f)), σ_1)

**(ApplyRecordCtorSigma-Ctrl)**

```text
RecordDefaultInits(p) = fields    Γ ⊢ EvalFieldInitsSigma(fields, σ) ⇓ (Ctrl(κ), σ_1)
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyRecordCtorSigma(p, σ) ⇓ (Ctrl(κ), σ_1)

#### 12.6.6 Lowering

AlignUp(x, a) = ⌈x/a⌉ × a    where a > 0
Offsets([]) = []

```text
Offsets(fields) = [offset_1, …, offset_n] ⇔ fields = [⟨f_1, T_1⟩, …, ⟨f_n, T_n⟩] ∧ n ≥ 1 ∧ offset_1 = 0 ∧ ∀ i ∈ {2, …, n}. offset_i = AlignUp(offset_{i-1} + sizeof(T_{i-1}), alignof(T_i))
RecordAlign([]) = 1

```text
RecordAlign(fields) = max_{i ∈ {1, …, n}}(alignof(T_i)) ⇔ fields = [⟨f_1, T_1⟩, …, ⟨f_n, T_n⟩] ∧ n ≥ 1
RecordSize([]) = 0

```text
RecordSize(fields) = AlignUp(offset_n + sizeof(T_n), RecordAlign(fields)) ⇔ fields = [⟨f_1, T_1⟩, …, ⟨f_n, T_n⟩] ∧ n ≥ 1 ∧ Offsets(fields) = [offset_1, …, offset_n]
RecordLayoutJudg = {RecordLayout}

**(Layout-Record-Empty)**
────────────────────────────────────────────────────────

```text
Γ ⊢ RecordLayout([]) ⇓ ⟨0, 1, []⟩

**(Layout-Record-Cons)**

```text
n ≥ 1    offsets = [offset_1, …, offset_n]    align = RecordAlign(fields)    size = RecordSize(fields)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ RecordLayout(fields) ⇓ ⟨size, align, offsets⟩

**(Size-Record)**

```text
T = TypePath(p)    RecordDecl(p) = R    Fields(R) = fields    RecordLayout(fields) ⇓ ⟨size, _, _⟩
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = size

**(Align-Record)**

```text
T = TypePath(p)    RecordDecl(p) = R    Fields(R) = fields    RecordLayout(fields) ⇓ ⟨_, align, _⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(T) = align

**(Layout-Record)**

```text
T = TypePath(p)    RecordDecl(p) = R    Fields(R) = fields    RecordLayout(fields) ⇓ ⟨size, align, _⟩
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨size, align⟩

```text
FieldOffset(fields, f_i) = offset_i ⇔ fields = [⟨f_1, T_1⟩, …, ⟨f_n, T_n⟩] ∧ 1 ≤ i ≤ n ∧ Offsets(fields) = [offset_1, …, offset_n]

```text
FieldValueList(fs, f) = v ⇔ ⟨f, v⟩ ∈ fs

```text
StructBits([T_1, …, T_n], [v_1, …, v_n], [o_1, …, o_n], size) = bits ⇔ |bits| = size ∧ ∀ i. ValueBits(T_i, v_i) = b_i ∧ bits[o_i..o_i+|b_i|) = b_i ∧ ∀ j. (∀ i. j ∉ [o_i, o_i+|b_i|)) ⇒ bits[j] = 0x00

```text
PadBytes(b, size) = bits ⇔ |bits| = size ∧ bits[0..|b|) = b ∧ ∀ i. |b| ≤ i < size ⇒ bits[i] = 0x00

```text
ValueBits(TypePath(p), v) = bits ⇔ RecordDecl(p) = R ∧ v = RecordValue(TypePath(p), fs) ∧ Fields(R) = fields ∧ RecordLayout(fields) ⇓ ⟨size, _, offsets⟩ ∧ fields = [⟨f_1, T_1⟩, …, ⟨f_n, T_n⟩] ∧ (∀ i. FieldValue(RecordValue(TypePath(p), fs), f_i) = v_i) ∧ StructBits([T_1, …, T_n], [v_1, …, v_n], offsets, size) = bits

**(LowerFieldInits-Empty)**
────────────────────────────────────────────────────

```text
Γ ⊢ LowerFieldInits([]) ⇓ ⟨ε, []⟩

**(LowerFieldInits-Cons)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩    Γ ⊢ LowerFieldInits(fs) ⇓ ⟨IR_s, vec_f⟩
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerFieldInits([⟨f, e⟩] ++ fs) ⇓ ⟨SeqIR(IR_e, IR_s), [⟨f, v⟩] ++ vec_f⟩

**(Lower-Expr-Record)**

```text
Γ ⊢ LowerFieldInits(fields) ⇓ ⟨IR, vec_f⟩
─────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(RecordExpr(tr, fields)) ⇓ ⟨IR, RecordValue(tr, vec_f)⟩

**(Lower-CallIR-RecordCtor)**

```text
CallTarget(callee) = RecordCtor(p)    args = []    RecordDefaultInits(p) = fields    Γ ⊢ LowerFieldInits(fields) ⇓ ⟨IR_f, vec_f⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(CallIR(callee, args)) ⇓ ⟨IR_f, RecordValue(TypePath(p), vec_f)⟩

#### 12.6.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                                |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------ |
| `E-TYP-1901` | Error    | Compile-time | Duplicate field name in record declaration                               |
| `E-TYP-1902` | Error    | Compile-time | Missing field initializer in record literal                              |
| `E-TYP-1903` | Error    | Compile-time | Duplicate field initializer in record literal                            |
| `E-TYP-1904` | Error    | Compile-time | Access to nonexistent field                                              |
| `E-TYP-1905` | Error    | Compile-time | Access to field not visible in current scope                             |
| `E-TYP-1906` | Error    | Compile-time | Field visibility exceeds record visibility                               |
| `E-TYP-1907` | Error    | Compile-time | Non-`Bitcopy` field requires move source expression                      |
| `E-TYP-1911` | Error    | Compile-time | Default record construction requires default initializer for every field |

### 12.7 Enums

#### 12.7.1 Syntax

```text
```

enum_decl        ::= attribute_list? visibility? "enum" identifier generic_params? implements_clause? predicate_clause? enum_body invariant_clause?
enum_body        ::= "{" variant_members? "}"
variant_members  ::= variant (terminator variant)* terminator?
variant          ::= identifier variant_payload_opt variant_discriminant_opt
variant_payload  ::= "(" type_list? ")" | "{" field_decl_list? "}"
variant_literal  ::= qualified_variant | qualified_variant "(" arg_exprs? ")" | qualified_variant "{" field_init_list "}"
```

Top-level enum cases are item-separated members. Between top-level enum cases, the implementation MUST accept only statement terminators (`newline` or `;`). A comma MUST NOT be accepted as an enum-case separator.

#### 12.7.2 Parsing

**(Parse-Enum)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `enum`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseGenericParamsOpt(P_2) ⇓ (P_3, gen_params_opt)    Γ ⊢ ParseImplementsOpt(P_3) ⇓ (P_4, impls)    Γ ⊢ ParsePredicateClauseOpt(P_4) ⇓ (P_5, predicate_clause_opt)    Γ ⊢ ParseEnumBody(P_5) ⇓ (P_6, variants)    Γ ⊢ ParseInvariantOpt(P_6) ⇓ (P_7, invariant_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (P_7, ⟨EnumDecl, attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, variants, invariant_opt, SpanBetween(P, P_7), []⟩)

**(Parse-EnumBody)**

```text
IsPunc(Tok(P), "{")    Γ ⊢ ParseVariantMembers(Advance(P)) ⇓ (P_1, vars)    IsPunc(Tok(P_1), "}")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseEnumBody(P) ⇓ (Advance(P_1), vars)

**(Parse-VariantMembers-Empty)**
IsPunc(Tok(P), "}")
────────────────────────────────────────────

```text
Γ ⊢ ParseVariantMembers(P) ⇓ (P, [])

**(Parse-VariantMembers-Cons)**

```text
Γ ⊢ ParseVariant(P) ⇓ (P_1, v)    Γ ⊢ ParseVariantSep(P_1) ⇓ P_2    Γ ⊢ ParseVariantMembers(P_2) ⇓ (P_3, vs)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseVariantMembers(P) ⇓ (P_3, [v] ++ vs)

**(Parse-VariantSep-End)**
IsPunc(Tok(P), "}")
────────────────────────────────────────────

```text
Γ ⊢ ParseVariantSep(P) ⇓ P

**(Parse-VariantSep-Terminator)**

```text
Γ ⊢ ConsumeTerminatorReq(P) ⇓ P_1
──────────────────────────────────

```text
Γ ⊢ ParseVariantSep(P) ⇓ P_1

**(Parse-Variant)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, name)    Γ ⊢ ParseVariantPayloadOpt(P_1) ⇓ (P_2, payload_opt)    Γ ⊢ ParseVariantDiscriminantOpt(P_2) ⇓ (P_3, disc_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseVariant(P) ⇓ (P_3, ⟨name, payload_opt, disc_opt⟩)

**(Parse-VariantPayloadOpt-None)**

```text
Tok(P) ∉ {Punctuator("("), Punctuator("{")}
────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseVariantPayloadOpt(P) ⇓ (P, ⊥)

**(Parse-VariantPayloadOpt-Tuple)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseTypeList(Advance(P)) ⇓ (P_1, ts)    IsPunc(Tok(P_1), ")")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseVariantPayloadOpt(P) ⇓ (Advance(P_1), TuplePayload(ts))

**(Parse-VariantPayloadOpt-Record)**

```text
IsPunc(Tok(P), "{")    Γ ⊢ ParseFieldDeclList(Advance(P)) ⇓ (P_1, fs)    IsPunc(Tok(P_1), "}")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseVariantPayloadOpt(P) ⇓ (Advance(P_1), RecordPayload(fs))

**(Parse-VariantDiscriminantOpt-None)**
¬ IsOp(Tok(P), "=")
─────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseVariantDiscriminantOpt(P) ⇓ (P, ⊥)

**(Parse-VariantDiscriminantOpt-Yes)**
IsOp(Tok(P), "=")    t = Tok(Advance(P))    t.kind = IntLiteral
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseVariantDiscriminantOpt(P) ⇓ (Advance(Advance(P)), t)

Commas are not valid separators between top-level enum variants. Payload forms within a variant continue to use the comma-delimited productions they reference.

Enum literal surface forms are parsed first as qualified names or qualified applies and are resolved to `EnumLiteral` by the static semantics of this section.

#### 12.7.3 AST Representation / Form

```text
EnumDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, implements, variants, invariant_opt, span, doc⟩

```text
EnumDecl.implements ∈ [ClassPath]

```text
VariantDecl = ⟨name, payload_opt, discriminant_opt, span, doc_opt⟩

```text
VariantPayload ∈ {TuplePayload = [Type], RecordPayload = [FieldDecl]}

```text
∀ f ∈ RecordPayload. f.init_opt = ⊥

Variants(E) = E.variants
BuiltinEnum = {`FileKind`, `IoError`, `AllocationError`, `Priority`}

```text
EnumPathOf(E) = [E.name]    if E.name ∈ BuiltinEnum
EnumPathOf(E) = FullPath(ModuleOf(E), E.name)    otherwise

```text
EnumPath(path) = p ⇔ SplitLast(path) = (p, n)

```text
VariantName(path) = n ⇔ SplitLast(path) = (p, n)

```text
VariantIndex(E, name) = i ⇔ Variants(E) = [v_0, …, v_k] ∧ v_i.name = name

#### 12.7.4 Static Semantics

**(Bind-Enum)**
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(EnumDecl(_, _, name, _, _, _, _, _, _, _), p) ⇓ [(name, ⟨Type, p, ⊥, Decl⟩)]

```text
PayloadOptWF(⊥)

```text
PayloadOptWF(TuplePayload([T_1, …, T_n])) ⇔ ∀ i. Γ ⊢ T_i wf

```text
PayloadOptWF(RecordPayload([⟨f_1, T_1⟩, …, ⟨f_k, T_k⟩])) ⇔ Distinct([f_1, …, f_k]) ∧ ∀ i. Γ ⊢ T_i wf

```text
Γ ⊢ payload_opt wf ⇔ PayloadOptWF(payload_opt)

**(Resolve-EnumUnit)**

```text
Γ ⊢ ResolveTypePath(path) ⇓ p    EnumDecl(p) = E    VariantPayload(E, name) = ⊥
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveEnumUnit(path, name) ⇓ p

**(Resolve-EnumTuple)**

```text
Γ ⊢ ResolveTypePath(path) ⇓ p    EnumDecl(p) = E    VariantPayload(E, name) = TuplePayload(_)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveEnumTuple(path, name) ⇓ p

**(Resolve-EnumRecord)**

```text
Γ ⊢ ResolveTypePath(path) ⇓ p    EnumDecl(p) = E    VariantPayload(E, name) = RecordPayload(_)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveEnumRecord(path, name) ⇓ p

**(ResolveQual-Name-Enum)**

```text
Γ ⊢ ResolveQualified(path, name, ValueKind) ↑    Γ ⊢ ResolveRecordPath(path, name) ↑    Γ ⊢ ResolveEnumUnit(path, name) ⇓ p
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveQualifiedForm(QualifiedName(path, name)) ⇓ EnumLiteral(FullPath(p, name), ⊥)

**(ResolveQual-Apply-Enum-Tuple)**

```text
Γ ⊢ ResolveArgs(args) ⇓ args'    Γ ⊢ ResolveQualified(path, name, ValueKind) ↑    Γ ⊢ ResolveRecordPath(path, name) ↑    Γ ⊢ ResolveEnumTuple(path, name) ⇓ p
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveQualifiedForm(QualifiedApply(path, name, Paren(args))) ⇓ EnumLiteral(FullPath(p, name), Paren(ArgsExprs(args')))

**(ResolveQual-Apply-Enum-Record)**

```text
Γ ⊢ ResolveFieldInits(fields) ⇓ fields'    Γ ⊢ ResolveRecordPath(path, name) ↑    Γ ⊢ ResolveEnumRecord(path, name) ⇓ p
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveQualifiedForm(QualifiedApply(path, name, Brace(fields))) ⇓ EnumLiteral(FullPath(p, name), Brace(fields'))

**(ResolveItem-Enum)**

```text
S_gen = TypeParamBindings(gen_params_opt)    Γ_g = [S_gen, S_module, S_universe]    Γ_g ⊢ ResolveGenericParamsOpt(gen_params_opt) ⇓ gen_params_opt'    Γ_g ⊢ ResolvePredicateClauseOpt(predicate_clause_opt) ⇓ predicate_clause_opt'    Γ_g ⊢ ResolveClassPathList(impls) ⇓ impls'    Γ_g ⊢ ResolveVariantList(vars) ⇓ vars'    Γ_g ⊢ ResolveInvariantOpt(invariant_opt) ⇓ invariant_opt'
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveItem(EnumDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, vars, invariant_opt, span, doc)) ⇓ EnumDecl(attrs_opt, vis, name, gen_params_opt', predicate_clause_opt', impls', vars', invariant_opt', span, doc)

DiscOf(v, n) =

```text
 n    if disc_opt(v) = ⊥
 DiscValue(tok)    if disc_opt(v) = tok
DiscValue(tok) = IntValue(tok)
DiscSeq([], n) = []
DiscSeq(v::vs, n) = [DiscOf(v, n)] ++ DiscSeq(vs, DiscOf(v, n) + 1)

```text
EnumVariantNames(E) = [v.name | v ∈ Variants(E)]

```text
EnumDiscriminants(E) ⇓ ds ⇔ ds = DiscSeq(Variants(E), 0) ∧ Distinct(ds) ∧ ∀ d ∈ ds. d ≥ 0

**(Enum-Disc-NotInt)**

```text
∃ v ∈ Variants(E). disc_opt(v) = tok    tok.kind ≠ IntLiteral    c = Code(Enum-Disc-NotInt)
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EnumDiscriminants(E) ⇑ c

**(Enum-Disc-Invalid)**

```text
∃ v ∈ Variants(E). disc_opt(v) = tok    DiscValue(tok) undefined    c = Code(Enum-Disc-Invalid)
──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EnumDiscriminants(E) ⇑ c

**(Enum-Disc-Negative)**

```text
∃ v ∈ Variants(E). disc_opt(v) = tok    DiscValue(tok) = d    d < 0    c = Code(Enum-Disc-Negative)
───────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EnumDiscriminants(E) ⇑ c

**(Enum-Disc-Dup)**
ds = DiscSeq(Variants(E), 0)    ¬ Distinct(ds)    c = Code(Enum-Disc-Dup)
───────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EnumDiscriminants(E) ⇑ c

**(Enum-Empty-Err)**
Variants(E) = []    c = Code(Enum-Empty-Err)
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ E enum : ok ⇑ c

**(Enum-Variant-Dup)**
names = EnumVariantNames(E)    ¬ Distinct(names)    c = Code(Enum-Variant-Dup)
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ E enum : ok ⇑ c

```text
MaxDisc(E) = max(ds) ⇔ EnumDiscriminants(E) ⇓ ds
DiscType(E) =

```text
 `u8`    if 0 ≤ MaxDisc(E) ≤ 255

```text
 `u16`   if 256 ≤ MaxDisc(E) ≤ 65,535

```text
 `u32`   if 65,536 ≤ MaxDisc(E) ≤ 4,294,967,295
 `u64`   otherwise

**(WF-EnumDecl)**

```text
E = EnumDecl(_, _, _, gen_params_opt, predicate_clause_opt, _, variants, _, _, _)    params_gen = TypeParamsOpt(gen_params_opt)    params_gen = [P_1, …, P_n]    Γ ⊢ ⟨P_1; …; P_n⟩ wf    Γ_g = BindTypeParams(Γ, params_gen)    Γ_g; params_gen ⊢ predicate_clause_opt wf    variants ≠ []    Distinct([v.name | v ∈ variants])    ∀ v ∈ variants, Γ_g ⊢ v.payload_opt wf    EnumDiscriminants(E) ⇓ _    Γ_g ⊢ TypePath(EnumPathOf(E)) : ImplementsOk
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ E enum : ok

```text
VariantPayload(E, v) = payload_opt ⇔ ∃ disc, span, doc. VariantDecl(v, payload_opt, disc, span, doc) ∈ E.variants

```text
VariantFieldNames(fs) = [ f | FieldDecl(_, _, _, f, _, _, _, _) ∈ fs ]
VariantFieldNameSet(fs) = Set(VariantFieldNames(fs))

```text
EnumFieldType(E, v, f) = T_f ⇔ VariantPayload(E, v) = RecordPayload(fs) ∧ ∃ attrs_opt, vis, boundary, init_opt, span, doc_opt. FieldDecl(attrs_opt, vis, boundary, f, T_f, init_opt, span, doc_opt) ∈ fs

```text
TuplePayloadArity(E, v) = n ⇔ VariantPayload(E, v) = TuplePayload([T_1, …, T_n])

**(T-Enum-Lit-Unit)**

```text
EnumDecl(EnumPath(path)) = E    v = VariantName(path)    VariantPayload(E, v) = ⊥
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ EnumLiteral(path, ⊥) : TypePath(EnumPath(path))

**(Enum-Lit-Unknown)**

```text
EnumDecl(EnumPath(path)) = E    VariantName(path) ∉ EnumVariantNames(E)    c = Code(Enum-Lit-Unknown)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ EnumLiteral(path, payload_opt) ⇑ c

**(T-Enum-Lit-Tuple)**

```text
EnumDecl(EnumPath(path)) = E    v = VariantName(path)    VariantPayload(E, v) = TuplePayload([T_1, …, T_n])    ∀ i, Γ; R; L ⊢ e_i ⇐ T_i ⊣ ∅
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ EnumLiteral(path, Paren([e_1, …, e_n])) : TypePath(EnumPath(path))

**(Enum-Lit-Tuple-Arity-Err)**

```text
EnumDecl(EnumPath(path)) = E    v = VariantName(path)    TuplePayloadArity(E, v) = n    |es| ≠ n    c = Code(Enum-Lit-Tuple-Arity-Err)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ EnumLiteral(path, Paren(es)) ⇑ c

**(T-Enum-Lit-Record)**

```text
EnumDecl(EnumPath(path)) = E    v = VariantName(path)    VariantPayload(E, v) = RecordPayload(fs)    Distinct(FieldInitNames(fields))    FieldInitSet(fields) = VariantFieldNameSet(fs)    ∀ ⟨f, e⟩ ∈ fields, Γ; R; L ⊢ e ⇐ EnumFieldType(E, v, f) ⊣ ∅
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ EnumLiteral(path, Brace(fields)) : TypePath(EnumPath(path))

**(Enum-Lit-Record-MissingField)**
EnumDecl(EnumPath(path)) = E    v = VariantName(path)    VariantPayload(E, v) = RecordPayload(fs)    FieldInitSet(fields) ⊂ VariantFieldNameSet(fs)    c = Code(Enum-Lit-Record-MissingField)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ EnumLiteral(path, Brace(fields)) ⇑ c

#### 12.7.5 Dynamic Semantics

```text
ValueType(EnumValue(path, payload)) = TypePath(p) ⇔ EnumPath(path) = p

**(EvalSigma-Enum-Unit)**
──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(EnumLiteral(path, ⊥), σ) ⇓ (Val(EnumValue(path, ⊥)), σ)

**(EvalSigma-Enum-Tuple)**

```text
Γ ⊢ EvalListSigma(es, σ) ⇓ (Val(vec_v), σ_1)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(EnumLiteral(path, Paren(es)), σ) ⇓ (Val(EnumValue(path, TuplePayload(vec_v))), σ_1)

**(EvalSigma-Enum-Tuple-Ctrl)**

```text
Γ ⊢ EvalListSigma(es, σ) ⇓ (Ctrl(κ), σ_1)
───────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(EnumLiteral(path, Paren(es)), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-Enum-Record)**

```text
Γ ⊢ EvalFieldInitsSigma(fields, σ) ⇓ (Val(vec_f), σ_1)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(EnumLiteral(path, Brace(fields)), σ) ⇓ (Val(EnumValue(path, RecordPayload(vec_f))), σ_1)

**(EvalSigma-Enum-Record-Ctrl)**

```text
Γ ⊢ EvalFieldInitsSigma(fields, σ) ⇓ (Ctrl(κ), σ_1)
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(EnumLiteral(path, Brace(fields)), σ) ⇓ (Ctrl(κ), σ_1)

#### 12.7.6 Lowering

```text
EnumDisc(E, name) = d ⇔ EnumDiscriminants(E) ⇓ ds ∧ VariantIndex(E, name) = i ∧ ds[i] = d

```text
VariantPayloadOpt(v) = payload_opt ⇔ v = ⟨name, payload_opt, disc_opt, span, doc_opt⟩

```text
VariantSize(v) = 0 ⇔ VariantPayloadOpt(v) = ⊥

```text
VariantAlign(v) = 1 ⇔ VariantPayloadOpt(v) = ⊥

```text
VariantSize(v) = s ⇔ VariantPayloadOpt(v) = TuplePayload([T_1, …, T_k]) ∧ TupleLayout([T_1, …, T_k]) ⇓ ⟨s, a, _⟩

```text
VariantAlign(v) = a ⇔ VariantPayloadOpt(v) = TuplePayload([T_1, …, T_k]) ∧ TupleLayout([T_1, …, T_k]) ⇓ ⟨s, a, _⟩

```text
VariantSize(v) = s ⇔ VariantPayloadOpt(v) = RecordPayload(fields) ∧ RecordLayout(fields) ⇓ ⟨s, a, _⟩

```text
VariantAlign(v) = a ⇔ VariantPayloadOpt(v) = RecordPayload(fields) ∧ RecordLayout(fields) ⇓ ⟨s, a, _⟩

```text
PayloadSize(E) = max_{v ∈ Variants(E)}(VariantSize(v))

```text
PayloadAlign(E) = max_{v ∈ Variants(E)}(VariantAlign(v))
EnumDiscType(E) = DiscType(E)
EnumAlign(E) = max(alignof(EnumDiscType(E)), PayloadAlign(E))
EnumSize(E) = AlignUp(sizeof(EnumDiscType(E)) + PayloadSize(E), EnumAlign(E))
EnumLayoutJudg = {EnumLayout}

**(Layout-Enum-Tagged)**
size = EnumSize(E)    align = EnumAlign(E)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ EnumLayout(E) ⇓ ⟨size, align, EnumDiscType(E), PayloadSize(E)⟩

**(Size-Enum)**

```text
T = TypePath(p)    EnumDecl(p) = E    EnumLayout(E) ⇓ ⟨size, _, _, _⟩
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = size

**(Align-Enum)**

```text
T = TypePath(p)    EnumDecl(p) = E    EnumLayout(E) ⇓ ⟨_, align, _, _⟩
─────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(T) = align

**(Layout-Enum)**

```text
T = TypePath(p)    EnumDecl(p) = E    EnumLayout(E) ⇓ ⟨size, align, _, _⟩
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨size, align⟩

```text
EnumPayloadBits(E, name, ⊥) = bits ⇔ (∃ v ∈ Variants(E). v.name = name ∧ VariantPayloadOpt(v) = ⊥) ∧ PadBytes([], PayloadSize(E)) = bits

```text
EnumPayloadBits(E, name, TuplePayload([v_1, …, v_k])) = bits ⇔ (∃ v ∈ Variants(E). v.name = name ∧ VariantPayloadOpt(v) = TuplePayload([T_1, …, T_k])) ∧ ValueBits(TypeTuple([T_1, …, T_k]), (v_1, …, v_k)) = b ∧ PadBytes(b, PayloadSize(E)) = bits

```text
EnumPayloadBits(E, name, RecordPayload(fs)) = bits ⇔ (∃ v ∈ Variants(E). v.name = name ∧ VariantPayloadOpt(v) = RecordPayload(fields)) ∧ RecordLayout(fields) ⇓ ⟨size, _, offsets⟩ ∧ fields = [⟨f_1, T_1⟩, …, ⟨f_n, T_n⟩] ∧ (∀ i. FieldValueList(fs, f_i) = v_i) ∧ StructBits([T_1, …, T_n], [v_1, …, v_n], offsets, size) = b ∧ PadBytes(b, PayloadSize(E)) = bits

```text
ValueBits(TypePath(p), v) = bits ⇔ EnumDecl(p) = E ∧ v = EnumValue(path, payload) ∧ EnumPath(path) = p ∧ name = VariantName(path) ∧ EnumDisc(E, name) = d ∧ EnumPayloadBits(E, name, payload) = payload_bits ∧ EnumDiscType(E) = D ∧ D = TypePrim(t) ∧ ValueBits(D, IntVal(t, d)) = disc_bits ∧ TaggedBits(disc_bits, payload_bits, sizeof(D), PayloadSize(E), PayloadAlign(E), EnumSize(E)) = bits

**(Lower-Expr-Enum-Unit)**
──────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(EnumLiteral(path, ⊥)) ⇓ ⟨ε, EnumValue(path, ⊥)⟩

**(Lower-Expr-Enum-Tuple)**

```text
Γ ⊢ LowerList(es) ⇓ ⟨IR, vec_v⟩
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(EnumLiteral(path, Paren(es))) ⇓ ⟨IR, EnumValue(path, TuplePayload(vec_v))⟩

**(Lower-Expr-Enum-Record)**

```text
Γ ⊢ LowerFieldInits(fields) ⇓ ⟨IR, vec_f⟩
──────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(EnumLiteral(path, Brace(fields))) ⇓ ⟨IR, EnumValue(path, RecordPayload(vec_f))⟩

#### 12.7.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-TYP-1920` | Error    | Compile-time | Enum discriminant is not an integer literal      |
| `E-TYP-1921` | Error    | Compile-time | Enum discriminant literal is invalid             |
| `E-TYP-1922` | Error    | Compile-time | Enum discriminant must be non-negative           |
| `E-TYP-1923` | Error    | Compile-time | Duplicate enum discriminant value                |
| `E-TYP-2001` | Error    | Compile-time | Enum declaration contains no variants            |
| `E-TYP-2002` | Error    | Compile-time | Duplicate variant name in enum declaration       |
| `E-TYP-2007` | Error    | Compile-time | Unknown variant name in enum construction        |
| `E-TYP-2008` | Error    | Compile-time | Variant payload arity mismatch                   |
| `E-TYP-2009` | Error    | Compile-time | Missing field initializer in record-like variant |

### 12.8 Union Types

#### 12.8.1 Syntax

```text
```

union_type ::= non_perm_type ("|" non_perm_type)+
```

Union introduction is semantic: any expression whose type is a member of a union may be typed as that union.

#### 12.8.2 Parsing

**(Parse-UnionTail-None)**
¬ IsOp(Tok(P), "|")
──────────────────────────────────────────────

```text
Γ ⊢ ParseUnionTail(P) ⇓ (P, [])

**(Parse-UnionTail-Cons)**

```text
IsOp(Tok(P), "|")    Γ ⊢ ParseNonPermType(Advance(P)) ⇓ (P_1, t_1)    Γ ⊢ ParseUnionTail(P_1) ⇓ (P_2, ts)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseUnionTail(P) ⇓ (P_2, [t_1] ++ ts)

#### 12.8.3 AST Representation / Form

```text
TypeUnion = ⟨members⟩ where members ∈ [Type]

Members(TypeUnion([T_1, …, T_n])) = [T_1, …, T_n]

```text
DistinctMembers(U) = [T_i ∈ Members(U) | ∀ j < i. ¬(Γ ⊢ T_i ≡ T_j)]

```text
SetMembers(U) = { T | T ∈ DistinctMembers(U) }

#### 12.8.4 Static Semantics

**(WF-Union)**

```text
T = TypeUnion([T_1, …, T_n])    n ≥ 2    ∀ i, Γ ⊢ T_i wf
────────────────────────────────────────────────────────

```text
Γ ⊢ T wf

**(WF-Union-TooFew)**
T = TypeUnion([T_1, …, T_n])    n < 2    c = Code(WF-Union-TooFew)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf ⇑ c

```text
Member(T, U) ⇔ U = TypeUnion([U_1, …, U_n]) ∧ ∃ i. Γ ⊢ T ≡ U_i

**(Sub-Member-Union)**
Member(T, U)
──────────────────────────────────────────────

```text
Γ ⊢ T <: U

**(Sub-Union-Width)**

```text
U_1 = TypeUnion([T_1, …, T_n])    U_2 = TypeUnion([U_1', …, U_m'])    ∀ i, Member(T_i, U_2)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ U_1 <: U_2

**(T-Union-Intro)**

```text
Γ ⊢ e : T    Member(T, U)
──────────────────────────────────────────────

```text
Γ ⊢ e : U

**(Union-DirectAccess-Err)**

```text
Γ; R; L ⊢ e : U    StripPerm(U) = TypeUnion(_)    c = Code(Union-DirectAccess-Err)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ FieldAccess(e, f) ⇑ c

Union matching and propagation are defined by §§16.8 and 17.5.

#### 12.8.5 Dynamic Semantics

```text
UnionCaseJudg = {UnionCase(v) = ⟨T, v_T⟩}

```text
UnionCase(v) = ⟨T, v_T⟩ ⇔ ∃ U, bits. ValueBits(TypeUnion(U), v) = bits ∧ UnionBits(U, T, v_T) = bits

#### 12.8.6 Lowering

```text
PathOrderKey(p) = ⟨Fold(p), p⟩

```text
BitsToUInt(bits) = v ⇔ LEBytes(v, |bits|) = bits

```text
bits_1 ≺_u bits_2 ⇔ ∃ v_1, v_2. BitsToUInt(bits_1) = v_1 ∧ BitsToUInt(bits_2) = v_2 ∧ v_1 < v_2
NicheOrder(T) = sort_{≺_u}(NicheSet(T))
NicheCount(T) = |NicheSet(T)|
TagKey(`prim`) = 0
TagKey(`tuple`) = 1
TagKey(`array`) = 2
TagKey(`slice`) = 3
TagKey(`func`) = 4
TagKey(`path`) = 5
TagKey(`modal_state`) = 6
TagKey(`string`) = 7
TagKey(`bytes`) = 8
TagKey(`dynamic`) = 9
TagKey(`ptr`) = 10
TagKey(`rawptr`) = 11
TagKey(`union`) = 12
TagKey(`perm`) = 13
TagKey(`range`) = 14

PermKey(`const`) = 0
PermKey(`unique`) = 1

```text
PtrStateKey(⊥) = 0
PtrStateKey(`Valid`) = 1
PtrStateKey(`Null`) = 2
PtrStateKey(`Expired`) = 3
QualKey(`imm`) = 0
QualKey(`mut`) = 1

```text
ModeKey(⊥) = 0
ModeKey(`move`) = 1
StateKey(`View`) = 0
StateKey(`Managed`) = 1

```text
StateKey(⊥) = 2

```text
TypeKey(TypePrim(name)) = ⟨TagKey(`prim`), name⟩

```text
TypeKey(TypeRange(T)) = ⟨TagKey(`range`), 0, TypeKey(T)⟩

```text
TypeKey(TypeRangeInclusive(T)) = ⟨TagKey(`range`), 1, TypeKey(T)⟩

```text
TypeKey(TypeRangeFrom(T)) = ⟨TagKey(`range`), 2, TypeKey(T)⟩

```text
TypeKey(TypeRangeTo(T)) = ⟨TagKey(`range`), 3, TypeKey(T)⟩

```text
TypeKey(TypeRangeToInclusive(T)) = ⟨TagKey(`range`), 4, TypeKey(T)⟩

```text
TypeKey(TypeRangeFull) = ⟨TagKey(`range`), 5⟩

```text
TypeKey(TypeTuple([T_1, …, T_n])) = ⟨TagKey(`tuple`), n, TypeKey(T_1), …, TypeKey(T_n)⟩

```text
TypeKey(TypeArray(T, e)) = ⟨TagKey(`array`), TypeKey(T), ArrayLen(e)⟩

```text
TypeKey(TypeSlice(T)) = ⟨TagKey(`slice`), TypeKey(T)⟩

```text
TypeKey(TypeFunc([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R)) = ⟨TagKey(`func`), n, ModeKey(m_1), TypeKey(T_1), …, ModeKey(m_n), TypeKey(T_n), TypeKey(R)⟩

```text
TypeKey(TypePath(p)) = ⟨TagKey(`path`), PathOrderKey(p)⟩

```text
TypeKey(TypeModalState(modal_ref, S)) = ⟨TagKey(`modal_state`), PathOrderKey(ModalRefPath(modal_ref)), S⟩

```text
TypeKey(TypeString(st)) = ⟨TagKey(`string`), StateKey(st)⟩

```text
TypeKey(TypeBytes(st)) = ⟨TagKey(`bytes`), StateKey(st)⟩

```text
TypeKey(TypeDynamic(p)) = ⟨TagKey(`dynamic`), PathOrderKey(p)⟩

```text
TypeKey(TypePtr(T, s)) = ⟨TagKey(`ptr`), PtrStateKey(s), TypeKey(T)⟩

```text
TypeKey(TypeRawPtr(q, T)) = ⟨TagKey(`rawptr`), QualKey(q), TypeKey(T)⟩

```text
TypeKey(TypeUnion([T_1, …, T_n])) = ⟨TagKey(`union`), Sort([TypeKey(T_1), …, TypeKey(T_n)])⟩

```text
TypeKey(TypePerm(p, T)) = ⟨TagKey(`perm`), PermKey(p), TypeKey(T)⟩

```text
Key = { TypeKey(T) | T ∈ Type }

```text
KeyList = { [k_1, …, k_n] | ∀ i. k_i ∈ Key }

```text
a ≺_{atom} b ⇔ (a, b ∈ ℕ ∧ a < b) ∨ (a, b ∈ String ∧ Utf8LexLess(a, b)) ∨ (a, b ∈ Key ∧ a ≺_{key} b) ∨ (a, b ∈ KeyList ∧ a ≺_{keylist} b)

```text
LexLess_{≺}(L_1, L_2) ⇔ (∃ k. 0 ≤ k < |L_1| ∧ 0 ≤ k < |L_2| ∧ (∀ i. 0 ≤ i < k ⇒ L_1[i] = L_2[i]) ∧ L_1[k] ≺ L_2[k]) ∨ (|L_1| < |L_2| ∧ ∀ i. 0 ≤ i < |L_1| ⇒ L_1[i] = L_2[i])

```text
k_1 ≺_{key} k_2 ⇔ LexLess_{≺_{atom}}(k_1, k_2)

```text
L_1 ≺_{keylist} L_2 ⇔ LexLess_{≺_{key}}(L_1, L_2)

```text
Sorted_{≺}(L) ⇔ ∀ i, j. 0 ≤ i < j < |L| ⇒ ¬(L[j] ≺ L[i])

```text
Sort(L) = L' ⇔ Permutation(L', L) ∧ Sorted_{≺_{key}}(L')

```text
T_1 ≺_{type} T_2 ⇔ TypeKey(T_1) ≺_{key} TypeKey(T_2)

MemberList(U) = Sort(Members(U))

```text
MemberIndex(U, T) = i ⇔ MemberList(U)[i] ≡ T

```text
UnionDiscValue(U, T) = i ⇔ MemberIndex(U, T) = i

```text
EmptyMember(T) ⇔ T ≡ TypePrim("()")

```text
EmptyList(U) = [MemberList(U)[i] | 0 ≤ i < |MemberList(U)| ∧ EmptyMember(MemberList(U)[i])]

```text
PayloadMember(U) = T_p ⇔ ∃ j. MemberList(U)[j] ≡ T_p ∧ NicheCount(T_p) > 0 ∧ (∀ i. 0 ≤ i < |MemberList(U)| ∧ i ≠ j ⇒ EmptyMember(MemberList(U)[i])) ∧ NicheCount(T_p) ≥ |MemberList(U)| - 1

```text
NicheApplies(U) ⇔ ∃ T_p. PayloadMember(U) = T_p

UnionDiscType(U) = DiscType(k)    where k = |MemberList(U)| - 1

```text
PayloadSize(U) = max_{T ∈ MemberList(U)}(sizeof(T))

```text
PayloadAlign(U) = max_{T ∈ MemberList(U)}(alignof(T))
UnionAlign(U) = max(alignof(UnionDiscType(U)), PayloadAlign(U))
UnionSize(U) = AlignUp(sizeof(UnionDiscType(U)) + PayloadSize(U), UnionAlign(U))
UnionLayoutJudg = {UnionLayout}

**(Layout-Union-Niche)**

```text
NicheApplies(U)    PayloadMember(U) = T_p    Γ ⊢ layout(T_p) ⇓ ⟨size, align⟩
──────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UnionLayout(U) ⇓ ⟨size, align, ⊥, layout(T_p)⟩

**(Layout-Union-Tagged)**
¬ NicheApplies(U)    size = UnionSize(U)    align = UnionAlign(U)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UnionLayout(U) ⇓ ⟨size, align, UnionDiscType(U), PayloadSize(U)⟩

**(Size-Union)**

```text
T = TypeUnion([T_1, …, T_n])    UnionLayout(T) ⇓ ⟨size, _, _, _⟩
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = size

**(Align-Union)**

```text
T = TypeUnion([T_1, …, T_n])    UnionLayout(T) ⇓ ⟨_, align, _, _⟩
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(T) = align

**(Layout-Union)**

```text
T = TypeUnion([T_1, …, T_n])    UnionLayout(T) ⇓ ⟨size, align, _, _⟩
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨size, align⟩

```text
UnionNicheBits(U, T, v) = bits ⇔ NicheApplies(U) ∧ PayloadMember(U) = T_p ∧ ((T ≡ T_p ∧ ValueBits(T_p, v) = bits ∧ bits ∉ NicheSet(T_p)) ∨ (∃ i. EmptyList(U)[i] ≡ T ∧ v = () ∧ NicheOrder(T_p)[i] = bits))

```text
PayloadBits(U, T, v) = bits ⇔ ValueBits(T, v) = b ∧ |bits| = PayloadSize(U) ∧ bits[0..|b|) = b

```text
TaggedBits(disc_bits, payload_bits, disc_size, payload_size, payload_align, size) = bits ⇔ |bits| = size ∧ payload_off = AlignUp(disc_size, payload_align) ∧ bits[0..disc_size) = disc_bits ∧ bits[payload_off..payload_off + payload_size) = payload_bits

**Informative.** TaggedBits constrains only the discriminant and payload ranges; bytes outside those ranges are unconstrained.

```text
UnionTaggedBits(U, T, v) = bits ⇔ ¬ NicheApplies(U) ∧ UnionDiscType(U) = D ∧ UnionDiscValue(U, T) = d ∧ ValueBits(D, d) = disc_bits ∧ PayloadBits(U, T, v) = payload_bits ∧ TaggedBits(disc_bits, payload_bits, sizeof(D), PayloadSize(U), PayloadAlign(U), UnionSize(U)) = bits

```text
UnionBits(U, T, v) = bits ⇔ UnionNicheBits(U, T, v) = bits ∨ UnionTaggedBits(U, T, v) = bits

```text
ValueBits(TypeUnion(U), v) = bits ⇔ ∃ T. Member(T, TypeUnion(U)) ∧ UnionBits(U, T, v) = bits

```text
ValueType(v) = U ⇔ ∃ T. ValueType(v) = T ∧ Member(T, U)

#### 12.8.7 Diagnostics

Diagnostics are defined for unions with fewer than two member types and for direct field access on union values without prior refinement or pattern matching. Exhaustiveness diagnostics for union `if ... is { ... }` case analysis are defined by §17.6.

### 12.9 Type Aliases

#### 12.9.1 Syntax

```text
```

type_alias_decl ::= attribute_list? visibility? "type" identifier generic_params? predicate_clause? "=" type
```

#### 12.9.2 Parsing

**(Parse-Type-Alias)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `type`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseGenericParamsOpt(P_2) ⇓ (P_3, gen_params_opt)    Γ ⊢ ParsePredicateClauseOpt(P_3) ⇓ (P_4, predicate_clause_opt)    IsOp(Tok(P_4), "=")    Γ ⊢ ParseType(Advance(P_4)) ⇓ (P_5, ty)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (P_5, ⟨TypeAliasDecl, attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, ty, SpanBetween(P, P_5), []⟩)

#### 12.9.3 AST Representation / Form

```text
TypeAliasDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, type, span, doc⟩

```text
AliasBody(p) = ty ⇔ Σ.Types[p] = TypeAliasDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, ty, span, doc)

```text
AliasParams(p) = gen_params_opt ⇔ Σ.Types[p] = TypeAliasDecl(_, _, _, gen_params_opt, _, _, _, _)

```text
AliasPredicateClause(p) = predicate_clause_opt ⇔ Σ.Types[p] = TypeAliasDecl(_, _, _, _, predicate_clause_opt, _, _, _)

#### 12.9.4 Static Semantics

**(Bind-TypeAlias)**
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(TypeAliasDecl(_, _, name, _, _, _, _, _), p) ⇓ [(name, ⟨Type, p, ⊥, Decl⟩)]

**(ResolveItem-TypeAlias)**

```text
S_gen = TypeParamBindings(gen_params_opt)    Γ_g = [S_gen, S_module, S_universe]    Γ_g ⊢ ResolveGenericParamsOpt(gen_params_opt) ⇓ gen_params_opt'    Γ_g ⊢ ResolvePredicateClauseOpt(predicate_clause_opt) ⇓ predicate_clause_opt'    Γ_g ⊢ ResolveType(ty) ⇓ ty'
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveItem(TypeAliasDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, ty, span, doc)) ⇓ TypeAliasDecl(attrs_opt, vis, name, gen_params_opt', predicate_clause_opt', ty', span, doc)

AliasStep(TypePath(p)) = AliasBody(p) if defined; otherwise TypePath(p)

```text
AliasStep(T) = T if T ∉ {TypePath(p)}
AliasNorm(T) =
 TypePerm(perm, AliasNorm(base))  if T = TypePerm(perm, base)

```text
 TypeTuple([AliasNorm(t) | t ∈ elems])  if T = TypeTuple(elems)
 TypeArray(AliasNorm(elem), size_expr)  if T = TypeArray(elem, size_expr)
 TypeSlice(AliasNorm(elem))  if T = TypeSlice(elem)

```text
 TypeUnion([AliasNorm(t) | t ∈ members])  if T = TypeUnion(members)

```text
 TypeFunc([⟨m, AliasNorm(t)⟩ | ⟨m, t⟩ ∈ params], AliasNorm(ret))  if T = TypeFunc(params, ret)

```text
 TypeApply(AliasPath(path), [AliasNorm(t) | t ∈ args])  if T = TypeApply(path, args)
 TypeDynamic(AliasPath(path))  if T = TypeDynamic(path)
 TypeOpaque(AliasPath(path))  if T = TypeOpaque(path)
 TypeModalState(AliasModalRef(modal_ref), state)  if T = TypeModalState(modal_ref, state)
 TypePtr(AliasNorm(elem), ptr_state_opt)  if T = TypePtr(elem, ptr_state_opt)
 TypeRawPtr(qual, AliasNorm(elem))  if T = TypeRawPtr(qual, elem)
 TypeRange(AliasNorm(base))  if T = TypeRange(base)
 TypeRangeInclusive(AliasNorm(base))  if T = TypeRangeInclusive(base)
 TypeRangeFrom(AliasNorm(base))  if T = TypeRangeFrom(base)
 TypeRangeTo(AliasNorm(base))  if T = TypeRangeTo(base)
 TypeRangeToInclusive(AliasNorm(base))  if T = TypeRangeToInclusive(base)
 TypeRefine(AliasNorm(base), pred)  if T = TypeRefine(base, pred)
 AliasNorm(AliasStep(T))  if T = TypePath(p)
 T  otherwise
AliasPath(p) = p if AliasBody(p) undefined
AliasPath(p) = AliasPath(p') if AliasBody(p) = TypePath(p')
AliasModalRef(TypePath(p)) = TypePath(AliasPath(p))

```text
AliasModalRef(TypeApply(p, args)) = TypeApply(AliasPath(p), [AliasNorm(t) | t ∈ args])

```text
AliasTransparent(T, U) ⇔ AliasNorm(T) = AliasNorm(U)

```text
AliasGraph = { ⟨p, q⟩ | AliasBody(p) = T ∧ q ∈ TypePaths(T) }
TypePaths(TypePrim(_)) = ∅
TypePaths(TypeRange(base)) = TypePaths(base)
TypePaths(TypeRangeInclusive(base)) = TypePaths(base)
TypePaths(TypeRangeFrom(base)) = TypePaths(base)
TypePaths(TypeRangeTo(base)) = TypePaths(base)
TypePaths(TypeRangeToInclusive(base)) = TypePaths(base)
TypePaths(TypeRangeFull) = ∅
TypePaths(TypePerm(_, T)) = TypePaths(T)
TypePaths(TypeTuple([T_1, …, T_n])) = ⋃_{i=1}^n TypePaths(T_i)
TypePaths(TypeArray(T, _)) = TypePaths(T)
TypePaths(TypeSlice(T)) = TypePaths(T)
TypePaths(TypeUnion([T_1, …, T_n])) = ⋃_{i=1}^n TypePaths(T_i)

```text
TypePaths(TypeFunc([⟨_, T_1⟩, …, ⟨_, T_n⟩], R)) = (⋃_{i=1}^n TypePaths(T_i)) ∪ TypePaths(R)

```text
TypePaths(TypeApply(p, args)) = {p} ∪ (⋃_{t ∈ args} TypePaths(t))
TypePaths(TypePtr(T, _)) = TypePaths(T)
TypePaths(TypeRawPtr(_, T)) = TypePaths(T)
TypePaths(TypeString(_)) = ∅
TypePaths(TypeBytes(_)) = ∅
TypePaths(TypeDynamic(p)) = {p}
TypePaths(TypeOpaque(p)) = {p}
TypePaths(TypeModalState(modal_ref, _)) = TypePathsOfModalRef(modal_ref)
TypePaths(TypePath(p)) = {p}
TypePaths(TypeRefine(base, _)) = TypePaths(base)
TypePathsOfModalRef(TypePath(p)) = {p}

```text
TypePathsOfModalRef(TypeApply(p, args)) = {p} ∪ (⋃_{t ∈ args} TypePaths(t))

```text
AliasCycle(p) ⇔ p ∈ Reach^+(AliasGraph, p)

```text
Σ.Types[p] = TypeAliasDecl(_, _, _, gen_params_opt, predicate_clause_opt, ty, _, _)    params_gen = TypeParamsOpt(gen_params_opt)    params_gen = [P_1, …, P_n]    Γ ⊢ ⟨P_1; …; P_n⟩ wf    Γ_g = BindTypeParams(Γ, params_gen)    Γ_g; params_gen ⊢ predicate_clause_opt wf    Γ_g ⊢ ty wf    ¬ AliasCycle(p)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ p : TypeAliasOk

AliasCycle(p)    c = Code(TypeAlias-Reultraviolet-Err)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ p : TypeAliasOk ⇑ c

#### 12.9.5 Dynamic Semantics

Type aliases introduce no distinct runtime values. Dynamic semantics use the alias body after alias normalization.

#### 12.9.6 Lowering

**(Size-Alias)**

```text
T = TypePath(p)    AliasBody(p) = ty    Γ ⊢ sizeof(ty) = size
───────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = size

**(Align-Alias)**

```text
T = TypePath(p)    AliasBody(p) = ty    Γ ⊢ alignof(ty) = align
────────────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(T) = align

**(Layout-Alias)**

```text
T = TypePath(p)    AliasBody(p) = ty    Γ ⊢ layout(ty) ⇓ ⟨size, align⟩
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨size, align⟩

```text
ValueBits(TypePath(p), v) = bits ⇔ AliasBody(p) = ty ∧ ValueBits(ty, v) = bits

#### 12.9.7 Diagnostics

Diagnostics are defined for reultraviolet type aliases. Generic-argument count and bound failures for alias applications are defined by the shared type-application rules in Chapter 14.

### 12.10 Data Type Diagnostics Supplement

This section owns diagnostics for array, slice, and union data-type rules that are shared across the Chapter 12 type forms.

| Code         | Severity | Detection    | Condition                                             |
| ------------ | -------- | ------------ | ----------------------------------------------------- |
| `E-TYP-1810` | Error    | Compile-time | Array length is not a compile-time constant           |
| `E-TYP-1812` | Error    | Compile-time | Array index expression has non-`usize` type           |
| `E-TYP-1820` | Error    | Compile-time | Slice index expression has non-`usize` type           |
| `E-TYP-2201` | Error    | Compile-time | Union type has fewer than two member types            |
| `E-TYP-2202` | Error    | Compile-time | Direct access on union value without pattern matching |
