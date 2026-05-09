---
title: "Expressions"
description: "16. Expressions of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T13:48:04.933Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 16. Expressions

### 16.1 Literal and Name Expressions

#### 16.1.1 Syntax

```text
```

literal_expr        ::= literal
null_ptr_expr       ::= "Ptr" "::" "null" "(" ")"
identifier_expr     ::= identifier
qualified_name_expr ::= path "::" identifier
```

Qualified applications with `(` ... `)` are owned by §16.3. Qualified applications with `{` ... `}` are owned by §16.6.

#### 16.1.2 Parsing

**(Parse-Literal-Expr)**

```text
Tok(P).kind ∈ {IntLiteral, FloatLiteral, StringLiteral, CharLiteral, BoolLiteral, NullLiteral}
───────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P), Literal(Tok(P)))

**(Parse-Null-Ptr)**
IsIdent(Tok(P))    Lexeme(Tok(P)) = `Ptr`    IsOp(Tok(Advance(P)), "::")    Tok(Advance(Advance(P))).kind = NullLiteral    IsPunc(Tok(Advance(Advance(Advance(P)))), "(")    IsPunc(Tok(Advance(Advance(Advance(Advance(P))))), ")")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(Advance(Advance(Advance(Advance(P))))), PtrNullExpr)

**(Parse-Identifier-Expr)**
IsIdent(Tok(P))    ¬ IsOp(Tok(Advance(P)), "::")    ¬ IsOp(Tok(Advance(P)), "@")    ¬ IsPunc(Tok(Advance(P)), "{")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P), Identifier(Lexeme(Tok(P))))

**(Parse-Qualified-Name)**

```text
Γ ⊢ ParseQualifiedHead(P) ⇓ (P_1, path, name)    Tok(P_1) ∉ {Punctuator("("), Punctuator("{")}    ¬ IsOp(Tok(P_1), "@")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (P_1, QualifiedName(path, name))

#### 16.1.3 AST Representation / Form

LiteralKind = {IntLiteral, FloatLiteral, StringLiteral, CharLiteral, BoolLiteral, NullLiteral}

```text
LiteralToken = { t ∈ Token | t.kind ∈ LiteralKind }

Expr = Literal(lit) | PtrNullExpr | Identifier(name) | QualifiedName(path, name) | Path(path, name) | ErrorExpr(span) | …
ExprSpan : Expr → Span

`QualifiedName(path, name)` is a pre-resolution expression form. Resolution rewrites it to one of:

- `Path(path', name')` for resolved value names
- `EnumLiteral(FullPath(p, name), ⊥)` for resolved unit enum variants

If neither form resolves, the name-resolution pass rejects the expression.

ValuePathType : Path × Ident ⇀ Type

```text
BuiltinModalStaticSig(path, name) = ⟨params, ret⟩ ⇔

```text
 (path = ["Region"] ∧ name = `new_scoped` ∧ RegionProcSig(`Region::new_scoped`) = ⟨params, ret⟩) ∨

```text
 (path = ["CancelToken"] ∧ name = `new` ∧ BuiltinModalProcSig(`CancelToken::new`) = ⟨params, ret⟩)
ValuePathType(path, name) = StaticType(path, name) if StaticType(path, name) defined

```text
ValuePathType(path, name) = TypeFunc([⟨mode, T⟩ | ⟨mode, x, T⟩ ∈ params], ret) if BuiltinModalStaticSig(path, name) = ⟨params, ret⟩

```text
ValuePathType(path, name) = TypeFunc([⟨mode, T⟩ | ⟨mode, x, T⟩ ∈ params], ProcReturn(ret_opt)) if DeclOf(path, name) = ProcedureDecl(_, _, _, gen_params_opt, _, params, ret_opt, _, _, _, _) ∧ TypeParamsOpt(gen_params_opt) = []

```text
ValuePathType(path, name) = TypeFunc([⟨mode, T⟩ | ⟨mode, x, T⟩ ∈ params], ProcReturn(ret_opt)) if DeclOf(path, name) = ExternProcDecl(_, _, _, _, _, params, ret_opt, _, _, _, _)
ValuePathType(path, name) undefined otherwise

#### 16.1.4 Static Semantics

IntTypes = {`i8`, `i16`, `i32`, `i64`, `i128`, `u8`, `u16`, `u32`, `u64`, `u128`, `isize`, `usize`}
FloatTypes = {`f16`, `f32`, `f64`}
FloatSuffixKinds = FloatTypes ∪ {`f`}
DefaultInt = `i32`
DefaultFloat = `f32`

```text
IntCore(s) ⇔ s matches (`decimal_integer` | `hex_integer` | `octal_integer` | `binary_integer`)

```text
FloatCore(s) ⇔ s matches (`decimal_integer` "." `decimal_integer`? `exponent`?)

```text
StripIntSuffix(s) = ⟨core, t⟩ ⇔ s = core ++ t ∧ t ∈ IntSuffixSet ∧ IntCore(core)

```text
StripIntSuffix(s) = ⟨s, ⊥⟩ ⇔ ¬ ∃ t. s = core ++ t ∧ t ∈ IntSuffixSet ∧ IntCore(core)

```text
StripFloatSuffix(s) = ⟨core, t⟩ ⇔ s = core ++ t ∧ t ∈ FloatSuffixSet ∧ FloatCore(core)

```text
StripFloatSuffix(s) = ⟨s, ⊥⟩ ⇔ FloatCore(s) ∧ ¬ ∃ t. s = core ++ t ∧ t ∈ FloatSuffixSet ∧ FloatCore(core)

```text
IntSuffix(lit) = t ⇔ lit.kind = IntLiteral ∧ StripIntSuffix(Lexeme(lit)) = ⟨_, t⟩

```text
FloatSuffix(lit) = t ⇔ lit.kind = FloatLiteral ∧ StripFloatSuffix(Lexeme(lit)) = ⟨_, t⟩

```text
NoFloatSuffix(lit) ⇔ lit.kind = FloatLiteral ∧ StripFloatSuffix(Lexeme(lit)) = ⟨_, ⊥⟩

```text
IntValueCore(s) = v ⇔ (s = "0x" ++ h ∧ v = HexValue(Digits(h))) ∨ (s = "0o" ++ o ∧ v = OctValue(Digits(o))) ∨ (s = "0b" ++ b ∧ v = BinValue(Digits(b))) ∨ (s matches `decimal_integer` ∧ v = DecValue(Digits(s)))

```text
IntValue(lit) = v ⇔ lit.kind = IntLiteral ∧ StripIntSuffix(Lexeme(lit)) = ⟨core, _⟩ ∧ IntValueCore(core) = v

```text
FloatParts(s) = ⟨a, b, e⟩ ⇔ s = a ++ "." ++ b ++ exp ∧ (exp = "" ⇒ e = 0) ∧ (exp ≠ "" ⇒ exp = "e" ++ sign ++ d ∨ exp = "E" ++ sign ++ d) ∧ (sign = "" ⇒ e = DecValue(Digits(d))) ∧ (sign = "+" ⇒ e = DecValue(Digits(d))) ∧ (sign = "-" ⇒ e = -DecValue(Digits(d)))

```text
FloatValueCore(s) = v ⇔ FloatParts(s) = ⟨a, b, e⟩ ∧ v = (DecValue(Digits(a)) · 10^{|Digits(b)|} + DecValue(Digits(b))) · 10^{e - |Digits(b)|}

```text
FloatValue(lit) = v ⇔ lit.kind = FloatLiteral ∧ StripFloatSuffix(Lexeme(lit)) = ⟨core, _⟩ ∧ FloatValueCore(core) = v

```text
InRange(v, T) ⇔ v ∈ RangeOf(T)

**(T-Int-Literal-Suffix)**
lit.kind = IntLiteral    IntSuffix(lit) = t    InRange(IntValue(lit), t)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Literal(lit) : TypePrim(t)

**(T-Int-Literal-Default)**

```text
lit.kind = IntLiteral    IntSuffix(lit) = ⊥    InRange(IntValue(lit), `i32`)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Literal(lit) : TypePrim(`i32`)

**(T-Float-Literal-Explicit)**

```text
lit.kind = FloatLiteral    FloatSuffix(lit) = t    t ∈ {`f16`, `f32`, `f64`}
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Literal(lit) : TypePrim(t)

**(T-Float-Literal-Infer)**
lit.kind = FloatLiteral    (FloatSuffix(lit) = `f` ∨ NoFloatSuffix(lit))
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Literal(lit) : TypePrim(`f32`)

**(T-Bool-Literal)**
lit.kind = BoolLiteral
──────────────────────────────────────────────

```text
Γ ⊢ Literal(lit) : TypePrim(`bool`)

**(T-Char-Literal)**
lit.kind = CharLiteral
──────────────────────────────────────────────

```text
Γ ⊢ Literal(lit) : TypePrim(`char`)

**(T-String-Literal)**
lit.kind = StringLiteral
──────────────────────────────────────────────────────────────

```text
Γ ⊢ Literal(lit) : TypeString(`@View`)

**(Syn-Literal)**

```text
Γ ⊢ Literal(lit) : T
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Literal(lit) ⇒ T ⊣ ∅

```text
NullLiteralExpected(T) ⇔ T = TypeRawPtr(q, U)

**(Chk-Int-Literal)**

```text
lit.kind = IntLiteral    T = TypePrim(t)    t ∈ IntTypes    InRange(IntValue(lit), t)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Literal(lit) ⇐ T ⊣ ∅

**(Chk-Float-Literal-Explicit)**

```text
lit.kind = FloatLiteral    FloatSuffix(lit) = s    s ∈ {`f16`, `f32`, `f64`}    T = TypePrim(s)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Literal(lit) ⇐ T ⊣ ∅

**(Chk-Float-Literal-Infer)**

```text
lit.kind = FloatLiteral    (FloatSuffix(lit) = `f` ∨ NoFloatSuffix(lit))    T = TypePrim(t)    t ∈ FloatTypes
─────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Literal(lit) ⇐ T ⊣ ∅

**(Chk-Null-Literal)**
lit.kind = NullLiteral    T = TypeRawPtr(q, U)
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Literal(lit) ⇐ T ⊣ ∅

```text
PtrNullExpected(T) ⇔ T = TypePtr(U, s) ∧ s ∈ {`Null`, ⊥}

**(Chk-Null-Ptr)**

```text
T = TypePtr(U, s)    s ∈ {`Null`, ⊥}
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ PtrNullExpr ⇐ T ⊣ ∅

**(Syn-PtrNull-Err)**
c = Code(PtrNull-Infer-Err)
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ PtrNullExpr ⇒ T ⊣ C ⇑ c

**(Chk-PtrNull-Err)**
¬ PtrNullExpected(T)    c = Code(PtrNull-Infer-Err)
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ PtrNullExpr ⇐ T ⊣ C ⇑ c

**(T-Ident)**

```text
(x : T) ∈ Γ    BitcopyType(T)
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Identifier(x) : T

**(T-Path-Value)**
ValuePathType(path, name) = T
──────────────────────────────────────────────

```text
Γ; R; L ⊢ Path(path, name) : T

**(Expr-Unresolved-Err)**

```text
e ∈ {QualifiedName(_, _)}    c = Code(ResolveExpr-Ident-Err)
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e ⇑ c

`QualifiedName` MUST be eliminated by name resolution before typing continues.

#### 16.1.5 Dynamic Semantics

```text
EvalJudg = {Γ ⊢ EvalSigma(e, σ) ⇓ (out, σ')}

```text
EvalOptJudg = {Γ ⊢ EvalOptSigma(e_opt, σ) ⇓ (out, σ')}

```text
EvalListJudg = {Γ ⊢ EvalListSigma(es, σ) ⇓ (out, σ'), Γ ⊢ EvalFieldInitsSigma(fields, σ) ⇓ (out, σ')}

```text
BoolValue(lit) = true ⇔ lit.kind = BoolLiteral ∧ Lexeme(lit) = "true"

```text
BoolValue(lit) = false ⇔ lit.kind = BoolLiteral ∧ Lexeme(lit) = "false"

```text
CharValue(lit) = u ⇔ lit.kind = CharLiteral ∧ T = Lexeme(lit) ∧ StringBytesFrom(T, 1, |T|-1) = bytes ∧ DecodeUTF8(bytes) = [u]

```text
LiteralValue(ℓ, TypePrim("bool")) = BoolVal(b) ⇔ ℓ.kind = BoolLiteral ∧ BoolValue(ℓ) = b

```text
LiteralValue(ℓ, TypePrim("char")) = CharVal(c) ⇔ ℓ.kind = CharLiteral ∧ CharValue(ℓ) = c

```text
LiteralValue(ℓ, TypeString(`@View`)) = v ⇔ ℓ.kind = StringLiteral ∧ ViewBytes(v) = StringBytes(ℓ)

```text
LiteralValue(ℓ, TypePrim(t)) = IntVal(t, x) ⇔ ℓ.kind = IntLiteral ∧ t ∈ IntTypes ∧ x = IntValue(ℓ)

```text
LiteralValue(ℓ, TypePrim(t)) = FloatVal(t, v) ⇔ ℓ.kind = FloatLiteral ∧ t ∈ FloatTypes ∧ v = FloatValue(ℓ)

```text
LiteralValue(ℓ, TypeRawPtr(q, U)) = RawPtr(q, 0x0) ⇔ ℓ.kind = NullLiteral

**(EvalSigma-Literal)**
T = ExprType(Literal(ℓ))    LiteralValue(ℓ, T) = v
──────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Literal(ℓ), σ) ⇓ (Val(v), σ)

**(EvalSigma-PtrNull)**
──────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(PtrNullExpr, σ) ⇓ (Val(Ptr@Null(0x0)), σ)

**(EvalSigma-Ident)**

```text
LookupVal(σ, x) = v
──────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Identifier(x), σ) ⇓ (Val(v), σ)

**(EvalSigma-Path)**

```text
LookupValPath(σ, path, name) = v
──────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Path(path, name), σ) ⇓ (Val(v), σ)

**(EvalSigma-ErrorExpr)**
────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(ErrorExpr(_), σ) ⇓ (Ctrl(Panic), σ)

Name and path evaluation MAY panic if the referenced module is poisoned. The poisoned-module cases are defined by `EvalSigma-Ident-Poison`, `EvalSigma-Ident-Poison-RecordCtor`, `EvalSigma-Path-Poison`, and `EvalSigma-Path-Poison-RecordCtor`.

#### 16.1.6 Lowering

**(Lower-Expr-Literal)**
T = ExprType(Literal(ℓ))    LiteralValue(ℓ, T) = v
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Literal(ℓ)) ⇓ ⟨ε, v⟩

**(Lower-Expr-PtrNull)**
───────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(PtrNullExpr) ⇓ ⟨ε, Ptr@Null(0x0)⟩

**(Lower-Expr-Ident-Local)**

```text
Γ ⊢ ResolveValueName(x) ⇓ ent    ent.origin_opt = ⊥    Γ ⊢ LowerReadPlace(Identifier(x)) ⇓ ⟨IR, v⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Identifier(x)) ⇓ ⟨IR, v⟩

**(Lower-Expr-Ident-Path)**

```text
Γ ⊢ ResolveValueName(x) ⇓ ent    ent.origin_opt = mp    name = (ent.target_opt if present, else x)    PathOfModule(mp) = path
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Identifier(x)) ⇓ ⟨ReadPathIR(path, name), v⟩

**(Lower-Expr-Path)**
──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Path(path, name)) ⇓ ⟨ReadPathIR(path, name), v⟩

**(Lower-Expr-Error)**
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(ErrorExpr(span)) ⇓ ⟨LowerPanic(ErrorExpr(span)), v_unreach⟩

#### 16.1.7 Diagnostics

Diagnostics are defined for unresolved qualified names, explicit float suffix mismatch during checking, null literals used without an expected raw-pointer type, and literal values that do not fit the required primitive type.

### 16.2 Access and Place Expressions

#### 16.2.1 Syntax

```text
```

access_suffix ::= "." identifier | "." decimal_literal | "[" expression "]"
place_expr    ::= "*" place_expr | postfix_expr
```

`postfix_expr` is the shared postfix-expression carrier. This section owns the access and place-specific suffix cases only. Call, method-call, and propagation postfix forms are owned by §§16.3 and 16.8.

#### 16.2.2 Parsing

**(Postfix-Field)**
IsPunc(Tok(P), ".")    IsIdent(Tok(Advance(P)))    name = Lexeme(Tok(Advance(P)))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PostfixStep(P, e) ⇓ (Advance(Advance(P)), FieldAccess(e, name))

**(Postfix-TupleIndex)**
IsPunc(Tok(P), ".")    t = Tok(Advance(P))    t.kind = IntLiteral    idx = IntValue(t)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PostfixStep(P, e) ⇓ (Advance(Advance(P)), TupleAccess(e, idx))

**(Postfix-Index)**

```text
IsPunc(Tok(P), "[")    Γ ⊢ ParseExpr(Advance(P)) ⇓ (P_1, idx)    IsPunc(Tok(P_1), "]")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PostfixStep(P, e) ⇓ (Advance(P_1), IndexAccess(e, idx))

```text
IsPlace(e) ⇔ e ∈ {Identifier(_), FieldAccess(_, _), TupleAccess(_, _), IndexAccess(_, _)} ∨ (∃ p. e = Deref(p) ∧ IsPlace(p))

**(Parse-Place-Deref)**

```text
IsOp(Tok(P), "*")    Γ ⊢ ParsePlace(Advance(P)) ⇓ (P_1, p)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePlace(P) ⇓ (P_1, Deref(p))

**(Parse-Place-Postfix)**

```text
Γ ⊢ ParsePostfix(P) ⇓ (P_1, e)    IsPlace(e)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePlace(P) ⇓ (P_1, e)

**(Parse-Place-Err)**

```text
Γ ⊢ ParsePostfix(P) ⇓ (P_1, e)    ¬ IsPlace(e)    c = Code(Parse-Syntax-Err)    Γ ⊢ Emit(c, Tok(P).span)    Γ ⊢ SyncStmt(P_1) ⇓ P_2
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePlace(P) ⇓ (P_2, ErrorExpr(SpanBetween(P, P_2)))

#### 16.2.3 AST Representation / Form

Expr = FieldAccess(base, name) | TupleAccess(base, index) | IndexAccess(base, index_expr) | Deref(expr) | …

PlaceForms0 = {Identifier(_), FieldAccess(_, _), TupleAccess(_, _), IndexAccess(_, _), Deref(_)}

```text
FieldVis(R, f) = vis ⇔ ⟨vis, f, T_f, _⟩ ∈ Fields(R)

```text
FieldVisible(m, R, f) ⇔ FieldVis(R, f) ∈ {`public`, `internal`} ∨ (FieldVis(R, f) = `private` ∧ ModuleOfPath(RecordPath(R)) = m)

```text
ConstTupleIndex(i) ⇔ ∃ n ∈ ℤ. i = n

```text
ConstIndex(e) ⇔ ∃ n. Γ ⊢ ConstLen(e) ⇓ n

```text
RangeIndexType(T_r) ⇔ T_r = TypeRange(TypePrim(`usize`)) ∨ T_r = TypeRangeInclusive(TypePrim(`usize`)) ∨ T_r = TypeRangeFrom(TypePrim(`usize`)) ∨ T_r = TypeRangeTo(TypePrim(`usize`)) ∨ T_r = TypeRangeToInclusive(TypePrim(`usize`)) ∨ T_r = TypeRangeFull

#### 16.2.4 Static Semantics

**(T-Field-Record)**

```text
Γ; R; L ⊢ e : TypePath(p)    RecordDecl(p) = R    FieldType(R, f) = T_f    FieldVisible(m, R, f)    BitcopyType(T_f)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ FieldAccess(e, f) : T_f

**(T-Field-Record-Perm)**

```text
Γ; R; L ⊢ e : TypePerm(p, TypePath(q))    RecordDecl(q) = R    FieldType(R, f) = T_f    FieldVisible(m, R, f)    BitcopyType(TypePerm(p, T_f))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ FieldAccess(e, f) : TypePerm(p, T_f)

**(P-Field-Record)**

```text
Γ; R; L ⊢ e :place TypePath(p)    RecordDecl(p) = R    FieldType(R, f) = T_f    FieldVisible(m, R, f)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ FieldAccess(e, f) :place T_f

**(P-Field-Record-Perm)**

```text
Γ; R; L ⊢ e :place TypePerm(p, TypePath(q))    RecordDecl(q) = R    FieldType(R, f) = T_f    FieldVisible(m, R, f)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ FieldAccess(e, f) :place TypePerm(p, T_f)

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

**(T-Index-Array)**

```text
Γ ⊢ e_1 : TypeArray(T, len)    Γ ⊢ e_2 : TypePrim(`usize`)    ConstIndex(e_2)    Γ ⊢ ConstLen(e_2) ⇓ i    Γ ⊢ ConstLen(len) ⇓ n    i < n    BitcopyType(T)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : T

**(T-Index-Array-Dynamic)**

```text
Γ ⊢ e_1 : TypeArray(T, len)    Γ ⊢ e_2 : TypePrim(`usize`)    ¬ ConstIndex(e_2)    InDynamicContext    BitcopyType(T)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : T

**(T-Index-Array-Perm)**

```text
Γ ⊢ e_1 : TypePerm(p, TypeArray(T, len))    Γ ⊢ e_2 : TypePrim(`usize`)    ConstIndex(e_2)    Γ ⊢ ConstLen(e_2) ⇓ i    Γ ⊢ ConstLen(len) ⇓ n    i < n    BitcopyType(TypePerm(p, T))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : TypePerm(p, T)

**(T-Index-Array-Perm-Dynamic)**

```text
Γ ⊢ e_1 : TypePerm(p, TypeArray(T, len))    Γ ⊢ e_2 : TypePrim(`usize`)    ¬ ConstIndex(e_2)    InDynamicContext    BitcopyType(TypePerm(p, T))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : TypePerm(p, T)

**(T-Index-Slice)**

```text
Γ ⊢ e_1 : TypeSlice(T)    Γ ⊢ e_2 : TypePrim(`usize`)    BitcopyType(T)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) : T

**(T-Index-Slice-Perm)**

```text
Γ ⊢ e_1 : TypePerm(p, TypeSlice(T))    Γ ⊢ e_2 : TypePrim(`usize`)    BitcopyType(TypePerm(p, T))
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

**(P-Index-Array)**, **(P-Index-Array-Perm)**, **(P-Index-Array-Dynamic)**, **(P-Index-Array-Perm-Dynamic)**, **(P-Index-Slice)**, **(P-Index-Slice-Perm)**, **(P-Slice-From-Array)**, **(P-Slice-From-Array-Perm)**, **(P-Slice-From-Slice)**, and **(P-Slice-From-Slice-Perm)** are the place-typing counterparts of the rules above. They preserve the same index admissibility conditions while returning `:place` judgments.

**(Coerce-Array-Slice)**

```text
Γ ⊢ e : TypePerm(p, TypeArray(T, n))
──────────────────────────────────────────────────────────────

```text
Γ ⊢ e : TypePerm(p, TypeSlice(T))

**(Union-DirectAccess-Err)**

```text
Γ; R; L ⊢ e : U    StripPerm(U) = TypeUnion(_)    c = Code(Union-DirectAccess-Err)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ FieldAccess(e, f) ⇑ c

**(ValueUse-NonBitcopyPlace)**
IsPlace(e)    ¬ BitcopyType(ExprType(e))    c = Code(ValueUse-NonBitcopyPlace)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e ⇑ c

#### 16.2.5 Dynamic Semantics

**(EvalSigma-FieldAccess)**

```text
Γ ⊢ EvalSigma(base, σ) ⇓ (Val(v_b), σ_1)    FieldValue(v_b, f) = v_f
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(FieldAccess(base, f), σ) ⇓ (Val(v_f), σ_1)

**(EvalSigma-TupleAccess)**

```text
Γ ⊢ EvalSigma(base, σ) ⇓ (Val(v_b), σ_1)    TupleValue(v_b, i) = v_i
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(TupleAccess(base, i), σ) ⇓ (Val(v_i), σ_1)

**(EvalSigma-Index)**

```text
Γ ⊢ EvalSigma(base, σ) ⇓ (Val(v_b), σ_1)    Γ ⊢ EvalSigma(idx, σ_1) ⇓ (Val(v_i), σ_2)    IndexValue(v_b, v_i) = v_e
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IndexAccess(base, idx), σ) ⇓ (Val(v_e), σ_2)

**(EvalSigma-Index-Range)**

```text
Γ ⊢ EvalSigma(base, σ) ⇓ (Val(v_b), σ_1)    Γ ⊢ EvalSigma(idx, σ_1) ⇓ (Val(v_r), σ_2)    SliceValue(v_b, v_r) = v_s
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IndexAccess(base, idx), σ) ⇓ (Val(v_s), σ_2)

Bounds failures in scalar and range indexing evaluate to `Ctrl(Panic)` as defined by `EvalSigma-Index-OOB` and `EvalSigma-Index-Range-OOB`. Base and index control-flow propagation are defined by `EvalSigma-FieldAccess-Ctrl`, `EvalSigma-TupleAccess-Ctrl`, `EvalSigma-Index-Ctrl-Base`, and `EvalSigma-Index-Ctrl-Idx`.

#### 16.2.6 Lowering

**(Lower-Expr-FieldAccess)**

```text
Γ ⊢ LowerExpr(base) ⇓ ⟨IR_b, v_b⟩    FieldValue(v_b, f) = v_f
──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(FieldAccess(base, f)) ⇓ ⟨IR_b, v_f⟩

**(Lower-Expr-TupleAccess)**

```text
Γ ⊢ LowerExpr(base) ⇓ ⟨IR_b, v_b⟩    TupleValue(v_b, i) = v_i
──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(TupleAccess(base, i)) ⇓ ⟨IR_b, v_i⟩

**(Lower-Expr-Index-Scalar-Static)**, **(Lower-Expr-Index-Scalar)**, **(Lower-Expr-Index-Scalar-OOB)**, **(Lower-Expr-Index-Range)**, and **(Lower-Expr-Index-Range-OOB)** lower scalar and slicing access with the required bounds checks.

**(Lower-Place-Ident)**
────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerPlace(Identifier(x)) ⇓ Identifier(x)

**(Lower-Place-Field)**

```text
Γ ⊢ LowerPlace(p) ⇓ l
─────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerPlace(FieldAccess(p, f)) ⇓ FieldAccess(l, f)

**(Lower-Place-Tuple)**

```text
Γ ⊢ LowerPlace(p) ⇓ l
─────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerPlace(TupleAccess(p, i)) ⇓ TupleAccess(l, i)

**(Lower-Place-Index)**

```text
Γ ⊢ LowerPlace(p) ⇓ l
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerPlace(IndexAccess(p, idx)) ⇓ IndexAccess(l, idx)

**(Lower-Place-Deref)**

```text
Γ ⊢ LowerPlace(p) ⇓ l
────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerPlace(Deref(p)) ⇓ Deref(l)

`LowerReadPlace`, `LowerWritePlace`, and `LowerWritePlaceSub` preserve the observable read/write behavior of access places. Assignment uses these rules via §18.4; move and address-of wrappers use them via §16.8.

#### 16.2.7 Diagnostics

Diagnostics are defined for unknown or inaccessible record fields, tuple indexing on non-tuples, non-constant tuple indices, tuple index out of bounds, non-`usize` array indices, non-constant array indices outside dynamic-checking contexts, out-of-bounds array and slice access, indexing non-indexable values, direct field access on unions, and value use of non-`Bitcopy` places.

Scalar indexing of arrays and slices is governed by the `TypePrim(`usize`)` requirement in §12.4.4. The corresponding non-`usize` diagnostics are `Index-Array-NonUsize` and `Index-Slice-NonUsize`. Scalar out-of-bounds access and range out-of-bounds slicing lower to panic through `EvalSigma-Index-OOB` and `EvalSigma-Index-Range-OOB`.

### 16.3 Call Expressions

#### 16.3.1 Syntax

```text
```

call_expr         ::= postfix_expr "(" argument_list? ")"
generic_call_expr ::= postfix_expr generic_args "(" argument_list? ")"
method_call_expr  ::= postfix_expr "~>" identifier "(" argument_list? ")"
argument_list     ::= argument ("," argument)*
argument          ::= "move"? expression
```

Qualified applications with parenthesized arguments parse before name resolution as `QualifiedApply(path, name, Paren(args))`.

#### 16.3.2 Parsing

**(Postfix-Call)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseArgList(Advance(P)) ⇓ (P_1, args)    IsPunc(Tok(P_1), ")")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PostfixStep(P, e) ⇓ (Advance(P_1), Call(e, args))

**(Postfix-Call-TypeArgs)**

```text
CallTypeArgsStart(P)    Γ ⊢ ParseGenericArgs(P) ⇓ (P_1, targs)    IsPunc(Tok(P_1), "(")    Γ ⊢ ParseArgList(Advance(P_1)) ⇓ (P_2, args)    IsPunc(Tok(P_2), ")")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PostfixStep(P, e) ⇓ (Advance(P_2), CallTypeArgs(e, targs, args))

**(Postfix-MethodCall)**

```text
IsOp(Tok(P), "~>")    Γ ⊢ ParseIdent(Advance(P)) ⇓ (P_1, name)    IsPunc(Tok(P_1), "(")    Γ ⊢ ParseArgList(Advance(P_1)) ⇓ (P_2, args)    IsPunc(Tok(P_2), ")")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PostfixStep(P, e) ⇓ (Advance(P_2), MethodCall(e, name, args))

**(Parse-Qualified-Apply-Paren)**

```text
Γ ⊢ ParseQualifiedHead(P) ⇓ (P_1, path, name)    IsPunc(Tok(P_1), "(")    Γ ⊢ ParseArgList(Advance(P_1)) ⇓ (P_2, args)    IsPunc(Tok(P_2), ")")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_2), QualifiedApply(path, name, Paren(args)))

**(Parse-ArgList-Empty)**, **(Parse-ArgList-Cons)**, **(Parse-Arg)**, **(Parse-ArgMoveOpt-None)**, **(Parse-ArgMoveOpt-Yes)**, **(Parse-ArgTail-End)**, **(Parse-ArgTail-TrailingComma)**, and **(Parse-ArgTail-Comma)** define argument-list parsing and move-mark parsing.

#### 16.3.3 AST Representation / Form

```text
Arg = ⟨moved, expr, span⟩    moved ∈ {true, false}

Expr = Call(callee, args) | CallTypeArgs(callee, type_args, args) | MethodCall(base, name, args) | QualifiedApply(path, name, Paren(args)) | …

```text
ArgMoved(⟨moved, e, span⟩) = moved

```text
ArgExpr(⟨moved, e, span⟩) = e

MovedArg(moved, e) =
  { MoveExpr(e)  if moved = true ∧ IsPlace(e)
    e            otherwise }

Qualified parenthesized applications are pre-resolution forms. Name resolution rewrites them to:

- `Call(Path(path', name'), args')` for value and built-in paths
- `Call(Path(mp, name'), args')` for record default-constructor references
- `EnumLiteral(FullPath(p, name), Paren(ArgsExprs(args')))` for tuple enum constructors

#### 16.3.4 Static Semantics

UnresolvedExpr = {QualifiedName(_, _), QualifiedApply(_, _, _)}

```text
ExprJudg = {Γ; R; L ⊢ e : T, Γ; R; L ⊢ e ⇐ T ⊣ C, Γ; R; L ⊢ p :place T, Γ; R; L ⊢ p ⇐_place T, Γ; R; L ⊢ r : Range}
ArgsOkTJudg = {ArgsOk_T}

```text
ParamMode(⟨mode, T⟩) = mode

```text
ParamType(⟨mode, T⟩) = T

```text
PlaceType(p) = T ⇔ Γ; R; L ⊢ p :place T

```text
HasSourceProvenance(e) ⇔ (∃ π. Γ; Ω ⊢ e ⇓ π ∧ π ≠ ⊥)
CallTemp(e) = p_tmp where ¬ HasSourceProvenance(e) ∧ Lifetime(p_tmp) = CallExtent ∧ ValueOf(p_tmp) = e
RefArgExpr(e) = { e if HasSourceProvenance(e) ; CallTemp(e) otherwise }
ConsumeArgExpr(mode, moved, e) =
  { MovedArg(moved, e)          if mode = `move` ∧ moved = true
    MovedArg(true, CallTemp(e)) if mode = `move` ∧ moved = false ∧ ¬ HasSourceProvenance(e)
    e                           otherwise }
ArgType(p, a) =
  { ExprType(ConsumeArgExpr(ParamMode(p), ArgMoved(a), ArgExpr(a)))    if ParamMode(p) = `move`

```text
    PlaceType(RefArgExpr(ArgExpr(a)))                                   if ParamMode(p) = ⊥ }

**(ArgsT-Empty)**
──────────────────────────────────────────────

```text
Γ; R; L ⊢ ArgsOk_T([], [])

**(ArgsT-Cons)**

```text
Γ; R; L ⊢ ConsumeArgExpr(`move`, moved, e) ⇐ T_p ⊣ ∅    (moved = true ∨ (moved = false ∧ ¬ HasSourceProvenance(e)))    Γ; R; L ⊢ ArgsOk_T(ps, as)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ArgsOk_T([⟨`move`, T_p⟩] ++ ps, [⟨moved, e, _⟩] ++ as)

**(ArgsT-Cons-Ref)**

```text
Γ; R; L ⊢ RefArgExpr(e) ⇐_place T_p    AddrOfOk(RefArgExpr(e))    moved = false    Γ; R; L ⊢ ArgsOk_T(ps, as)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ArgsOk_T([⟨⊥, T_p⟩] ++ ps, [⟨moved, e, _⟩] ++ as)

**(T-Call-Generic-Infer)**

```text
Γ; R; L ⊢ GenericCallInference(callee, args, ⊥) ⇓ [A_1, …, A_n]    Γ; R; L ⊢ CallTypeArgs(callee, [A_1, …, A_n], args) : R_c
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) : R_c

**(T-Call)**

```text
Γ; R; L ⊢ callee : TypeFunc(params, R_c)    Γ; R; L ⊢ ArgsOk_T(params, args)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) : R_c

**(Call-Callee-NotFunc)**

```text
Γ; R; L ⊢ callee : T    T ≠ TypeFunc(_, _)    ¬(RecordCallee(callee) ∧ args = [])    c = Code(Call-Callee-NotFunc)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) ⇑ c

**(Call-ArgCount-Err)**

```text
Γ; R; L ⊢ callee : TypeFunc(params, _)    |params| ≠ |args|    c = Code(Call-ArgCount-Err)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) ⇑ c

**(Call-ArgType-Err)**

```text
Γ; R; L ⊢ callee : TypeFunc(params, _)    ∃ i. ¬(Γ; R; L ⊢ ArgType(params[i], args[i]) <: ParamType(params[i]))    c = Code(Call-ArgType-Err)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) ⇑ c

**(Call-Move-Missing)**

```text
Γ; R; L ⊢ callee : TypeFunc(params, _)    ∃ i. ParamMode(params[i]) = `move` ∧ ArgMoved(args[i]) = false ∧ HasSourceProvenance(ArgExpr(args[i]))    c = Code(Call-Move-Missing)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) ⇑ c

**(Call-Move-Unexpected)**

```text
Γ; R; L ⊢ callee : TypeFunc(params, _)    ∃ i. ParamMode(params[i]) = ⊥ ∧ ArgMoved(args[i]) = true    c = Code(Call-Move-Unexpected)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) ⇑ c

**(Call-Arg-Packed-Unsafe-Err)**

```text
Γ; R; L ⊢ callee : TypeFunc(params, _)    ∃ i. ParamMode(params[i]) = ⊥ ∧ PackedField(ArgExpr(args[i])) ∧ ¬ UnsafeSpan(span(ArgExpr(args[i])))    c = Code(Packed-Field-Unsafe-Err)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) ⇑ c

**(Call-Arg-NotPlace)**

```text
Γ; R; L ⊢ callee : TypeFunc(params, _)    ∃ i. ParamMode(params[i]) = ⊥ ∧ HasSourceProvenance(ArgExpr(args[i])) ∧ ¬ IsPlace(ArgExpr(args[i]))    c = Code(Call-Arg-NotPlace)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) ⇑ c

**(Chk-Call-Generic-Infer)**

```text
Γ; R; L ⊢ GenericCallInference(callee, args, T_exp) ⇓ [A_1, …, A_n]    Γ; R; L ⊢ CallTypeArgs(callee, [A_1, …, A_n], args) : R_c    Γ ⊢ R_c <: T_exp
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) ⇐ T_exp ⊣ ∅

Explicit and inferred type-argument calls use `CallTypeArgs`. Their bound checking, defaulted argument completion, omitted-argument inference, and elaboration to monomorphic `Call` are defined in §14.2.4.

Method-call typing is defined in §15.2.4 for concrete receivers and in §14.6.4 for dynamic `$Class` receivers. Record-default construction via `Call(callee, [])` is defined in §16.6.4. Calls whose callee has closure type are defined in §16.9.4.

Calls to `extern` procedures outside `unsafe` are rejected by the FFI boundary rule in §23.2.4.

#### 16.3.5 Dynamic Semantics

**(EvalSigma-Call-Closure)**

```text
ExprType(callee) = TypeClosure(_, _, _)    Γ ⊢ EvalSigma(ClosureCall(callee, args), σ) ⇓ (out, σ_1)
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Call(callee, args), σ) ⇓ (out, σ_1)

**(EvalSigma-Call-RegionProc)**

```text
Γ ⊢ EvalSigma(callee, σ) ⇓ (Val(FuncVal(sym)), σ_1)    Γ ⊢ BuiltinModalSym(`Region::`name) ⇓ sym    RegionProcParams(name) = params    Γ ⊢ EvalArgsSigma(params, args, σ_1) ⇓ (Val(vec_v), σ_2)    Γ ⊢ ApplyRegionProc(name, vec_v, σ_2) ⇓ (out, σ_3)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Call(callee, args), σ) ⇓ (out, σ_3)

**(EvalSigma-Call-RegionProc-Ctrl-Args)**

```text
Γ ⊢ EvalSigma(callee, σ) ⇓ (Val(FuncVal(sym)), σ_1)    Γ ⊢ BuiltinModalSym(`Region::`name) ⇓ sym    RegionProcParams(name) = params    Γ ⊢ EvalArgsSigma(params, args, σ_1) ⇓ (Ctrl(κ), σ_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Call(callee, args), σ) ⇓ (Ctrl(κ), σ_2)

**(EvalSigma-Call-CancelProc)**

```text
Γ ⊢ EvalSigma(callee, σ) ⇓ (Val(FuncVal(sym)), σ_1)    Γ ⊢ BuiltinModalSym(`CancelToken::`name) ⇓ sym    CancelProcParams(name) = params    Γ ⊢ EvalArgsSigma(params, args, σ_1) ⇓ (Val(vec_v), σ_2)    Γ ⊢ ApplyCancelProc(name, vec_v, σ_2) ⇓ (out, σ_3)
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Call(callee, args), σ) ⇓ (out, σ_3)

**(EvalSigma-Call-CancelProc-Ctrl-Args)**

```text
Γ ⊢ EvalSigma(callee, σ) ⇓ (Val(FuncVal(sym)), σ_1)    Γ ⊢ BuiltinModalSym(`CancelToken::`name) ⇓ sym    CancelProcParams(name) = params    Γ ⊢ EvalArgsSigma(params, args, σ_1) ⇓ (Ctrl(κ), σ_2)
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Call(callee, args), σ) ⇓ (Ctrl(κ), σ_2)

**(EvalSigma-Call-Proc)**

```text
Γ ⊢ EvalSigma(callee, σ) ⇓ (Val(v_c), σ_1)    proc = CallTarget(v_c)    Γ ⊢ EvalArgsSigma(proc.params, args, σ_1) ⇓ (Val(vec_v), σ_2)    Γ ⊢ ApplyProcSigma(proc, vec_v, σ_2) ⇓ (out, σ_3)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Call(callee, args), σ) ⇓ (out, σ_3)

**(EvalSigma-Call-Record)**

```text
Γ ⊢ EvalSigma(callee, σ) ⇓ (Val(v_c), σ_1)    Γ ⊢ EvalArgsSigma([], args, σ_1) ⇓ (Val(vec_v), σ_2)    vec_v = []    RecordCtor(p) = CallTarget(v_c)    Γ ⊢ ApplyRecordCtorSigma(p, σ_2) ⇓ (out, σ_3)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Call(callee, args), σ) ⇓ (out, σ_3)

**(EvalSigma-MethodCall)**

```text
mode = RecvArgMode(base)    Γ ⊢ EvalRecvSigma(base, mode, σ) ⇓ (Val(⟨v_self, v_arg⟩), σ_1)    m = MethodTarget(v_self, name)    Γ ⊢ EvalArgsSigma(m.params, args, σ_1) ⇓ (Val(vec_v), σ_2)    Γ ⊢ ApplyMethodSigma(base, name, v_self, v_arg, vec_v, σ_2) ⇓ (out, σ_3)
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(MethodCall(base, name, args), σ) ⇓ (out, σ_3)

**(EvalSigma-Call-Ctrl)** and **(EvalSigma-Call-Ctrl-Args)** propagate control results from callee and argument evaluation.

**(EvalSigma-MethodCall-Ctrl)** and **(EvalSigma-MethodCall-Ctrl-Args)** propagate control results from receiver evaluation and argument evaluation.

`CallTypeArgs` is elaborated to `Call` before evaluation. Closure-typed calls use the closure-application rules owned by §16.9.5.

#### 16.3.6 Lowering

**(Lower-Args-Empty)**
──────────────────────────────────────────────────────

```text
Γ ⊢ LowerArgs([], []) ⇓ ⟨ε, []⟩

**(Lower-Args-Cons-Move)**

```text
Γ ⊢ LowerExpr(MovedArg(moved, e)) ⇓ ⟨IR_e, v⟩    Γ ⊢ LowerArgs(ps, as) ⇓ ⟨IR_a, vec_v⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerArgs([⟨`move`, x, T_p⟩] ++ ps, [⟨moved, e, _⟩] ++ as) ⇓ ⟨SeqIR(IR_e, IR_a), [v] ++ vec_v⟩

**(Lower-Args-Cons-Ref)**

```text
Γ ⊢ LowerAddrOf(RefArgExpr(e)) ⇓ ⟨IR_e, addr⟩    Γ ⊢ LowerArgs(ps, as) ⇓ ⟨IR_a, vec_v⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerArgs([⟨⊥, x, T_p⟩] ++ ps, [⟨moved, e, _⟩] ++ as) ⇓ ⟨SeqIR(IR_e, IR_a), [Ptr@Valid(addr)] ++ vec_v⟩

**(Lower-Expr-Call-Closure)**

```text
ExprType(callee) = TypeClosure(_, _, _)    Γ ⊢ LowerClosureCall(callee, args) ⇓ ⟨IR, v⟩
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Call(callee, args)) ⇓ ⟨IR, v⟩

**(Lower-Expr-Call-PanicOut)** and **(Lower-Expr-Call-NoPanicOut)** lower ordinary calls after callee and argument evaluation.

**(Lower-MethodCall-Static-PanicOut)**, **(Lower-MethodCall-Static-NoPanicOut)**, **(Lower-MethodCall-Capability)**, and **(Lower-MethodCall-Dynamic)** lower concrete, capability, and dynamic dispatch method calls.

`CallTypeArgs` does not survive lowering; §14.2.6 requires elaboration to monomorphic `Call` first. Closure-call lowering is owned by §16.9.6.

#### 16.3.7 Diagnostics

Diagnostics are defined for non-callable callees, wrong argument count, wrong argument type, missing `move` at consuming call sites, unexpected `move` on by-reference parameters, non-place reference arguments, packed-field by-reference arguments outside `unsafe`, calls to `extern` procedures outside `unsafe`, unresolved qualified parenthesized applications, and the closure-specific conditions owned by §16.9.7.

### 16.4 Operator Expressions

#### 16.4.1 Syntax

```text
```

range_expression    ::= logical_or_expr ".." logical_or_expr
                      | logical_or_expr "..=" logical_or_expr
                      | logical_or_expr ".."
                      | ".." logical_or_expr
                      | "..=" logical_or_expr
                      | ".."
logical_or_expr     ::= logical_and_expr ("||" logical_and_expr)*
logical_and_expr    ::= comparison_expr ("&&" comparison_expr)*
comparison_expr     ::= bitwise_or_expr (("==" | "!=" | "<" | "<=" | ">" | ">=") bitwise_or_expr)*
bitwise_or_expr     ::= bitwise_xor_expr ("|" bitwise_xor_expr)*
bitwise_xor_expr    ::= bitwise_and_expr ("^" bitwise_and_expr)*
bitwise_and_expr    ::= shift_expr ("&" shift_expr)*
shift_expr          ::= additive_expr (("<<" | ">>") additive_expr)*
additive_expr       ::= multiplicative_expr (("+" | "-") multiplicative_expr)*
multiplicative_expr ::= power_expr (("*" | "/" | "%") power_expr)*
power_expr          ::= unary_expr ("**" power_expr)?
unary_operator      ::= "!" | "-"
```

Cast syntax is owned by §16.5. Dereference and `widen` prefix forms are owned by §§16.8 and 13.5.

#### 16.4.2 Parsing

**(Parse-Range-To)**, **(Parse-Range-ToInc)**, **(Parse-Range-Full)**, **(Parse-Range-Lhs)**, **(Parse-RangeTail-None)**, **(Parse-RangeTail-From)**, **(Parse-RangeTail-Excl)**, and **(Parse-RangeTail-Incl)** define the six range-expression forms.

**(Parse-LeftChain)**, **(Parse-LeftChain-Stop)**, and **(Parse-LeftChain-Cons)** define left-associative parsing for logical, comparison, bitwise, shift, additive, and multiplicative chains.

**(Parse-Power)**, **(Parse-PowerTail-None)**, and **(Parse-PowerTail-Cons)** define right-associative exponentiation.

**(Parse-Unary-Prefix)**

```text
Tok(P) = op ∈ {"!", "-"}    Γ ⊢ ParseUnary(Advance(P)) ⇓ (P_1, e)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseUnary(P) ⇓ (P_1, Unary(op, e))

#### 16.4.3 AST Representation / Form

RangeKind = {`To`, `ToInclusive`, `Full`, `From`, `Exclusive`, `Inclusive`}
Expr = Unary(op, expr) | Binary(op, left, right) | Range(kind, lo_opt, hi_opt) | …

ArithOps = {"+", "-", "*", "/", "%", "**"}
BitOps = {"&", "|", "^"}
ShiftOps = {"<<", ">>"}
LogicOps = {"&&", "||"}

#### 16.4.4 Static Semantics

```text
EqType(T) ⇔ (StripPerm(T) = TypePrim(t) ∧ t ∈ NumericTypes ∪ {`bool`, `char`}) ∨ StripPerm(T) = TypePtr(U, s) ∨ StripPerm(T) = TypeRawPtr(q, U) ∨ StripPerm(T) = TypeString(st) ∨ StripPerm(T) = TypeBytes(st)

```text
OrdType(T) ⇔ StripPerm(T) = TypePrim(t) ∧ t ∈ IntTypes ∪ FloatTypes ∪ {`char`}

```text
IsRangeType(T) ⇔ T = TypeRange(_) ∨ T = TypeRangeInclusive(_) ∨ T = TypeRangeFrom(_) ∨ T = TypeRangeTo(_) ∨ T = TypeRangeToInclusive(_) ∨ T = TypeRangeFull

**(T-Range-Lift)**

```text
Γ; R; L ⊢ r : Range    ExprType(r) = T
────────────────────────────────────────────────

```text
Γ; R; L ⊢ r : T

**(Range-Full)**, **(Range-To)**, **(Range-ToInclusive)**, **(Range-From)**, **(Range-Exclusive)**, and **(Range-Inclusive)** assign the corresponding range carrier type based on the presence and type of lower and upper bounds.

**(T-Not-Bool)**

```text
Γ; R; L ⊢ e : TypePrim(`bool`)
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Unary("!", e) : TypePrim(`bool`)

**(T-Not-Int)**

```text
Γ; R; L ⊢ e : TypePrim(t)    t ∈ IntTypes
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Unary("!", e) : TypePrim(t)

**(T-Neg)**

```text
Γ; R; L ⊢ e : TypePrim(t)    t ∈ SignedIntTypes ∪ FloatTypes
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Unary("-", e) : TypePrim(t)

**(T-Arith)**

```text
Γ; R; L ⊢ e_1 : T    Γ; R; L ⊢ e_2 : T    StripPerm(T) = TypePrim(t)    t ∈ NumericTypes    op ∈ ArithOps
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Binary(op, e_1, e_2) : TypePrim(t)

**(T-Bitwise)**

```text
Γ; R; L ⊢ e_1 : T    Γ; R; L ⊢ e_2 : T    StripPerm(T) = TypePrim(t)    t ∈ IntTypes    op ∈ BitOps
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Binary(op, e_1, e_2) : TypePrim(t)

**(T-Shift)**

```text
Γ; R; L ⊢ e_1 : T_1    Γ; R; L ⊢ e_2 : TypePrim(`u32`)    StripPerm(T_1) = TypePrim(t)    t ∈ IntTypes    op ∈ ShiftOps
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Binary(op, e_1, e_2) : TypePrim(t)

**(T-Compare-Eq)**

```text
Γ; R; L ⊢ e_1 : T    Γ; R; L ⊢ e_2 : T    EqType(T)    op ∈ {"==", "!="}
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Binary(op, e_1, e_2) : TypePrim(`bool`)

**(T-Compare-Ord)**

```text
Γ; R; L ⊢ e_1 : T    Γ; R; L ⊢ e_2 : T    OrdType(T)    op ∈ {"<", "<=", ">", ">="}
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Binary(op, e_1, e_2) : TypePrim(`bool`)

**(T-Logical)**

```text
Γ; R; L ⊢ e_1 : TypePrim(`bool`)    Γ; R; L ⊢ e_2 : TypePrim(`bool`)    op ∈ LogicOps
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Binary(op, e_1, e_2) : TypePrim(`bool`)

#### 16.4.5 Dynamic Semantics

```text
RetType(Γ) ∈ Type

```text
OpJudg = {UnOp(op, v) ⇓ v', BinOp(op, v_1, v_2) ⇓ v}

```text
NumericValue(v, t) ⇔ ValueType(v) = TypePrim(t) ∧ t ∈ NumericTypes

```text
IntValue(v, t) ⇔ ValueType(v) = TypePrim(t) ∧ t ∈ IntTypes

```text
FloatValue(v, t) ⇔ ValueType(v) = TypePrim(t) ∧ t ∈ FloatTypes

```text
SignedIntValue(v) ⇔ ∃ t. t ∈ SignedIntTypes ∧ ValueType(v) = TypePrim(t)

```text
SignedTypeOf(v) = t ⇔ t ∈ SignedIntTypes ∧ ValueType(v) = TypePrim(t)

```text
U32Value(v) ⇔ ValueType(v) = TypePrim("u32")

```text
EqValue(v_1, v_2) ⇔ ∃ T. ValueType(v_1) = T ∧ ValueType(v_2) = T ∧ EqType(T)

```text
OrdValue(v_1, v_2) ⇔ ∃ T. ValueType(v_1) = T ∧ ValueType(v_2) = T ∧ OrdType(T)

```text
IsNaN(t, v) ⇔ t ∈ FloatTypes ∧ v = FloatVal(t, x) ∧ IEEE754Encode(t, x) = CanonicalNaNBits(t)

```text
OrdScalar(v) = x ⇔ (∃ t. v = IntVal(t, x) ∧ t ∈ IntTypes) ∨ (∃ u. v = CharVal(u) ∧ x = u)

```text
Cmp("==", v_1, v_2) = b ⇔ EqValue(v_1, v_2) ∧ ((∃ t. FloatValue(v_1, t) ∧ FloatValue(v_2, t) ∧ (IsNaN(t, v_1) ∨ IsNaN(t, v_2)) ∧ b = false) ∨ (¬ ∃ t. FloatValue(v_1, t) ∧ FloatValue(v_2, t) ∧ (IsNaN(t, v_1) ∨ IsNaN(t, v_2)) ∧ b = (v_1 = v_2)))

```text
Cmp("!=", v_1, v_2) = b ⇔ EqValue(v_1, v_2) ∧ ((∃ t. FloatValue(v_1, t) ∧ FloatValue(v_2, t) ∧ (IsNaN(t, v_1) ∨ IsNaN(t, v_2)) ∧ b = true) ∨ (¬ ∃ t. FloatValue(v_1, t) ∧ FloatValue(v_2, t) ∧ (IsNaN(t, v_1) ∨ IsNaN(t, v_2)) ∧ b = (v_1 ≠ v_2)))

```text
Cmp("<", v_1, v_2) = b ⇔ OrdValue(v_1, v_2) ∧ ((∃ t. FloatValue(v_1, t) ∧ FloatValue(v_2, t) ∧ ((IsNaN(t, v_1) ∨ IsNaN(t, v_2)) ∧ b = false) ∨ (¬ (IsNaN(t, v_1) ∨ IsNaN(t, v_2)) ∧ x_1 = FloatValValue(v_1) ∧ x_2 = FloatValValue(v_2) ∧ b = (x_1 < x_2))) ∨ (∃ x_1, x_2. OrdScalar(v_1) = x_1 ∧ OrdScalar(v_2) = x_2 ∧ b = (x_1 < x_2)))

```text
Cmp("<=", v_1, v_2) = b ⇔ OrdValue(v_1, v_2) ∧ ((∃ t. FloatValue(v_1, t) ∧ FloatValue(v_2, t) ∧ ((IsNaN(t, v_1) ∨ IsNaN(t, v_2)) ∧ b = false) ∨ (¬ (IsNaN(t, v_1) ∨ IsNaN(t, v_2)) ∧ x_1 = FloatValValue(v_1) ∧ x_2 = FloatValValue(v_2) ∧ b = (x_1 ≤ x_2))) ∨ (∃ x_1, x_2. OrdScalar(v_1) = x_1 ∧ OrdScalar(v_2) = x_2 ∧ b = (x_1 ≤ x_2)))

```text
Cmp(">", v_1, v_2) = b ⇔ OrdValue(v_1, v_2) ∧ ((∃ t. FloatValue(v_1, t) ∧ FloatValue(v_2, t) ∧ ((IsNaN(t, v_1) ∨ IsNaN(t, v_2)) ∧ b = false) ∨ (¬ (IsNaN(t, v_1) ∨ IsNaN(t, v_2)) ∧ x_1 = FloatValValue(v_1) ∧ x_2 = FloatValValue(v_2) ∧ b = (x_1 > x_2))) ∨ (∃ x_1, x_2. OrdScalar(v_1) = x_1 ∧ OrdScalar(v_2) = x_2 ∧ b = (x_1 > x_2)))

```text
Cmp(">=", v_1, v_2) = b ⇔ OrdValue(v_1, v_2) ∧ ((∃ t. FloatValue(v_1, t) ∧ FloatValue(v_2, t) ∧ ((IsNaN(t, v_1) ∨ IsNaN(t, v_2)) ∧ b = false) ∨ (¬ (IsNaN(t, v_1) ∨ IsNaN(t, v_2)) ∧ x_1 = FloatValValue(v_1) ∧ x_2 = FloatValValue(v_2) ∧ b = (x_1 ≥ x_2))) ∨ (∃ x_1, x_2. OrdScalar(v_1) = x_1 ∧ OrdScalar(v_2) = x_2 ∧ b = (x_1 ≥ x_2)))

```text
BitAt(u, i) = b ⇔ b ∈ {0, 1} ∧ ∃ q, r. u = q · 2^{i + 1} + b · 2^i + r ∧ 0 ≤ r < 2^i

```text
BitNot(v) = v' ⇔ ∃ t, x, w, u, u'. v = IntVal(t, x) ∧ w = IntWidth(t) ∧ u = ToUnsigned(w, x) ∧ u' = (2^w - 1) - u ∧ ((t ∈ SignedIntTypes ∧ v' = IntVal(t, ToSigned(w, u'))) ∨ (t ∈ UnsignedIntTypes ∧ v' = IntVal(t, u')))

```text
BitOp(op, t, v_1, v_2) = v ⇔ v_1 = IntVal(t, x_1) ∧ v_2 = IntVal(t, x_2) ∧ w = IntWidth(t) ∧ u_1 = ToUnsigned(w, x_1) ∧ u_2 = ToUnsigned(w, x_2) ∧ u = ∑_{i=0}^{w-1} b_i 2^i ∧ ∀ i. 0 ≤ i < w ⇒ ((op = "&" ∧ b_i = BitAt(u_1, i) · BitAt(u_2, i)) ∨ (op = "|" ∧ b_i = max(BitAt(u_1, i), BitAt(u_2, i))) ∨ (op = "^" ∧ b_i = (BitAt(u_1, i) + BitAt(u_2, i)) mod 2)) ∧ ((t ∈ SignedIntTypes ∧ v = IntVal(t, ToSigned(w, u))) ∨ (t ∈ UnsignedIntTypes ∧ v = IntVal(t, u)))

```text
ShiftOp(op, t, v_1, v_2) = v ⇔ v_1 = IntVal(t, x_1) ∧ v_2 = IntVal("u32", n) ∧ w = IntWidth(t) ∧ 0 ≤ n < w ∧ u_1 = ToUnsigned(w, x_1) ∧ ((op = "<<" ∧ u = (u_1 · 2^n) mod 2^w) ∨ (op = ">>" ∧ u = ⌊u_1 / 2^n⌋)) ∧ ((t ∈ SignedIntTypes ∧ v = IntVal(t, ToSigned(w, u))) ∨ (t ∈ UnsignedIntTypes ∧ v = IntVal(t, u)))

```text
PowInt(x, n) = y ⇔ n ∈ ℕ ∧ ((n = 0 ∧ y = 1) ∨ (n > 0 ∧ y = x · PowInt(x, n - 1)))

```text
PowFloat(t, x_1, x_2) = x ⇔ t ∈ FloatTypes ∧ x_1 ∈ FloatValueSet(t) ∧ x_2 ∈ FloatValueSet(t) ∧ x is the IEEE 754-2019 pow result of x_1, x_2 in format FloatFormat(t)

```text
IEEEArith(op, t, v_1, v_2) = v ⇔ v_1 = FloatVal(t, x_1) ∧ v_2 = FloatVal(t, x_2) ∧ op ∈ ArithOps ∧ ((op ∈ {"+", "-", "*", "/"} ∧ x is the IEEE 754-2019 result of applying op to x_1, x_2 in format FloatFormat(t)) ∨ (op = "%" ∧ x is the IEEE 754-2019 remainder of x_1, x_2 in format FloatFormat(t)) ∨ (op = "**" ∧ PowFloat(t, x_1, x_2) = x)) ∧ v = FloatVal(t, x)

```text
∀ t ∈ FloatTypes, v_1, v_2, op ∈ ArithOps. ∃ v. IEEEArith(op, t, v_1, v_2) = v

```text
UnOp("!", false) ⇓ true

```text
UnOp("!", true) ⇓ false

```text
UnOp("!", v) ⇓ v' ⇔ IntValue(v, t) ∧ v' = BitNot(v)

```text
UnOp("-", v) ⇓ v' ⇔ v = IntVal(t, x) ∧ t ∈ SignedIntTypes ∧ x' = -x ∧ InRange(x', t) ∧ v' = IntVal(t, x')

```text
UnOp("-", v) ⇓ v' ⇔ v = FloatVal(t, x) ∧ v' = FloatVal(t, -x)

```text
UnOp("widen", v) ⇓ ModalVal(S, v) ⇔ v = RecordValue(ModalStateRef(modal_ref, S), fs)

For floating-point operands, unary `-` is total (no overflow panic) and MUST preserve width (`f16`/`f32`/`f64`) while applying IEEE-754 sign negation.

```text
BinOp(op, v_1, v_2) ⇓ v ⇔ op ∈ ArithOps ∧ NumericValue(v_1, t) ∧ NumericValue(v_2, t) ∧ ArithEval(op, t, v_1, v_2) ⇓ v

```text
BinOp(op, v_1, v_2) ⇓ v ⇔ op ∈ BitOps ∧ IntValue(v_1, t) ∧ IntValue(v_2, t) ∧ BitEval(op, t, v_1, v_2) ⇓ v

```text
BinOp(op, v_1, v_2) ⇓ v ⇔ op ∈ ShiftOps ∧ IntValue(v_1, t) ∧ U32Value(v_2) ∧ ShiftEval(op, t, v_1, v_2) ⇓ v

```text
BinOp(op, v_1, v_2) ⇓ v ⇔ op ∈ {"==", "!="} ∧ EqValue(v_1, v_2) ∧ v = Cmp(op, v_1, v_2)

```text
BinOp(op, v_1, v_2) ⇓ v ⇔ op ∈ {"<", "<=", ">", ">="} ∧ OrdValue(v_1, v_2) ∧ v = Cmp(op, v_1, v_2)

```text
ArithEval(op, t, v_1, v_2) ⇓ v ⇔ t ∈ IntTypes ∧ v_1 = IntVal(t, x_1) ∧ v_2 = IntVal(t, x_2) ∧ ((op ∈ {"+", "-", "*"} ∧ x = x_1 op x_2) ∨ (op ∈ {"/", "%"} ∧ x_2 ≠ 0 ∧ x = x_1 op x_2) ∨ (op = "**" ∧ x_2 ≥ 0 ∧ PowInt(x_1, x_2) = x)) ∧ InRange(x, t) ∧ v = IntVal(t, x)

```text
ArithEval(op, t, v_1, v_2) ⇓ v ⇔ t ∈ FloatTypes ∧ v = IEEEArith(op, t, v_1, v_2)

```text
BitEval(op, t, v_1, v_2) ⇓ v ⇔ t ∈ IntTypes ∧ v = BitOp(op, t, v_1, v_2)

```text
ShiftEval(op, t, v_1, v_2) ⇓ v ⇔ t ∈ IntTypes ∧ v = ShiftOp(op, t, v_1, v_2)

**(EvalSigma-Range)**

```text
Γ ⊢ EvalOptSigma(lo_opt, σ_0) ⇓ (Val(v_lo), σ_1)    Γ ⊢ EvalOptSigma(hi_opt, σ_1) ⇓ (Val(v_hi), σ_2)    r = RangeVal(kind, v_lo, v_hi)
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Range(kind, lo_opt, hi_opt), σ_0) ⇓ (Val(r), σ_2)

**(EvalSigma-Unary)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    UnOp(op, v) ⇓ v'
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Unary(op, e), σ) ⇓ (Val(v'), σ_1)

**(EvalSigma-Bin-And-False)**

```text
Γ ⊢ EvalSigma(e_1, σ) ⇓ (Val(false), σ_1)
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Binary("&&", e_1, e_2), σ) ⇓ (Val(false), σ_1)

**(EvalSigma-Bin-And-True)**

```text
Γ ⊢ EvalSigma(e_1, σ) ⇓ (Val(true), σ_1)    Γ ⊢ EvalSigma(e_2, σ_1) ⇓ (out, σ_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Binary("&&", e_1, e_2), σ) ⇓ (out, σ_2)

**(EvalSigma-Bin-Or-True)**

```text
Γ ⊢ EvalSigma(e_1, σ) ⇓ (Val(true), σ_1)
─────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Binary("||", e_1, e_2), σ) ⇓ (Val(true), σ_1)

**(EvalSigma-Bin-Or-False)**

```text
Γ ⊢ EvalSigma(e_1, σ) ⇓ (Val(false), σ_1)    Γ ⊢ EvalSigma(e_2, σ_1) ⇓ (out, σ_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Binary("||", e_1, e_2), σ) ⇓ (out, σ_2)

**(EvalSigma-Binary)**

```text
op ∉ {"&&", "||"}    Γ ⊢ EvalSigma(e_1, σ) ⇓ (Val(v_1), σ_1)    Γ ⊢ EvalSigma(e_2, σ_1) ⇓ (Val(v_2), σ_2)    BinOp(op, v_1, v_2) ⇓ v
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Binary(op, e_1, e_2), σ) ⇓ (Val(v), σ_2)

If `UnOp` or `BinOp` is undefined, evaluation produces `Ctrl(Panic)`. The old draft defines NaN-sensitive comparison behavior through `Cmp`; ordered float comparisons with NaN yield `false`, `==` yields `false`, and `!=` yields `true`.

#### 16.4.6 Lowering

**(Lower-Expr-Unary)**

```text
Γ ⊢ LowerUnOp(op, e) ⇓ ⟨IR, v⟩
───────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Unary(op, e)) ⇓ ⟨IR, v⟩

**(Lower-Expr-Bin-And)**

```text
Γ ⊢ LowerExpr(e_1) ⇓ ⟨IR_1, v_1⟩    Γ ⊢ LowerExpr(e_2) ⇓ ⟨IR_2, v_2⟩
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Binary("&&", e_1, e_2)) ⇓ ⟨SeqIR(IR_1, IfIR(v_1, IR_2, v_2, ε, false)), v_and⟩

**(Lower-Expr-Bin-Or)**

```text
Γ ⊢ LowerExpr(e_1) ⇓ ⟨IR_1, v_1⟩    Γ ⊢ LowerExpr(e_2) ⇓ ⟨IR_2, v_2⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Binary("||", e_1, e_2)) ⇓ ⟨SeqIR(IR_1, IfIR(v_1, ε, true, IR_2, v_2)), v_or⟩

**(Lower-Expr-Binary)**

```text
op ∉ {"&&", "||"}    Γ ⊢ LowerBinOp(op, e_1, e_2) ⇓ ⟨IR, v⟩
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Binary(op, e_1, e_2)) ⇓ ⟨IR, v⟩

**(Lower-Expr-Range)**

```text
Γ ⊢ LowerRangeExpr(Range(kind, lo_opt, hi_opt)) ⇓ ⟨IR, v⟩
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Range(kind, lo_opt, hi_opt)) ⇓ ⟨IR, v⟩

OpPanicReason("-") = Overflow

```text
NeedsUnOpPanicCheck(op, T) ⇔ op = "-" ∧ StripPerm(T) = TypePrim(t) ∧ t ∈ SignedIntTypes

**(Lower-UnOp-Ok)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩    T = ExprType(e)    ¬ NeedsUnOpPanicCheck(op, T)    v_r = FreshTemp("unop")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerUnOp(op, e) ⇓ ⟨SeqIR(IR_e, UnOpIR(op, v, v_r)), v_r⟩

**(Lower-UnOp-Panic)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩    T = ExprType(e)    NeedsUnOpPanicCheck(op, T)    r = OpPanicReason(op)    v_r = FreshTemp("unop")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerUnOp(op, e) ⇓ ⟨SeqIR(IR_e, CheckOpIR(op, v, r), PanicCheckIR, UnOpIR(op, v, v_r)), v_r⟩

For unary `-`, overflow checks MUST be emitted only when `NeedsUnOpPanicCheck` holds. Unary `-` on floating operands MUST NOT lower an overflow check.

`Lower-BinOp-Ok`, `Lower-BinOp-Panic`, and `Lower-Range-Full` through `Lower-Range-Exclusive` define the remaining panic-triggering and range-value construction behavior.

#### 16.4.7 Diagnostics

Diagnostics are defined for operator-operand type mismatches, ill-typed range bounds, and dynamic operator failures that lower to panic when primitive unary or binary evaluation is undefined.

### 16.5 Cast and Transmute Expressions

#### 16.5.1 Syntax

```text
```

cast_expr      ::= unary_expr ("as" type)?
transmute_expr ::= "transmute" "<" type "," type ">" "(" expression ")"
```

The `widen` prefix form is canonically defined in §13.5. This section references it only where cast/transmute expression families need that cross-reference.

#### 16.5.2 Parsing

**(Parse-Cast)**

```text
Γ ⊢ ParseUnary(P) ⇓ (P_1, e)    Γ ⊢ ParseCastTail(P_1, e) ⇓ (P_2, e')
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseCast(P) ⇓ (P_2, e')

**(Parse-CastTail-None)**
¬ IsKw(Tok(P), `as`)
──────────────────────────────────────────────

```text
Γ ⊢ ParseCastTail(P, e) ⇓ (P, e)

**(Parse-CastTail-As)**

```text
IsKw(Tok(P), `as`)    Γ ⊢ ParseType(Advance(P)) ⇓ (P_1, t)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseCastTail(P, e) ⇓ (P_1, Cast(e, t))

**(Parse-Transmute-Expr-ShiftSplit)** and **(Parse-Transmute-Expr)** parse the two accepted tokenizations of `transmute<T1, T2>(e)`.

`widen` parsing is defined in §13.5.2.

#### 16.5.3 AST Representation / Form

Expr = Cast(expr, type) | TransmuteExpr(src_type, dst_type, expr) | …

`Unary("widen", e)` is owned by §13.5.3.

#### 16.5.4 Static Semantics

S' = StripPerm(S)
T' = StripPerm(T)

```text
CastValid(S, T) ⇔ (S' = TypePrim(s) ∧ T' = TypePrim(t) ∧ s, t ∈ NumericTypes) ∨ (S' = TypePrim(`bool`) ∧ T' = TypePrim(t) ∧ t ∈ IntTypes) ∨ (S' = TypePrim(t) ∧ t ∈ IntTypes ∧ T' = TypePrim(`bool`)) ∨ (S' = TypePrim(`char`) ∧ T' = TypePrim(`u32`)) ∨ (S' = TypePrim(`u32`) ∧ T' = TypePrim(`char`))

**(T-Cast)**

```text
Γ; R; L ⊢ e : S    CastValid(S, T)
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Cast(e, T) : T

**(T-Cast-Invalid)**

```text
Γ; R; L ⊢ e : S    ¬ CastValid(S, T)    c = Code(E-SEM-2528)
────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Cast(e, T) ⇑ c

**(T-Transmute-SizeEq)**

```text
Γ ⊢ sizeof(t_1) = sizeof(t_2)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ TransmuteSizeOk(t_1, t_2)

**(T-Transmute-AlignEq)**

```text
Γ ⊢ alignof(t_1) = alignof(t_2)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ TransmuteAlignOk(t_1, t_2)

**(T-Transmute)**

```text
UnsafeSpan(span(TransmuteExpr(t_1, t_2, e)))    Γ ⊢ t_1 wf    Γ ⊢ t_2 wf    Γ ⊢ TransmuteSizeOk(t_1, t_2)    Γ ⊢ TransmuteAlignOk(t_1, t_2)    Γ; R; L ⊢ e : t_1
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ TransmuteExpr(t_1, t_2, e) : t_2

**(Transmute-Unsafe-Err)**
¬ UnsafeSpan(span(TransmuteExpr(t_1, t_2, e)))    c = Code(Transmute-Unsafe-Err)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ TransmuteExpr(t_1, t_2, e) ⇑ c

```text
ValidTransmuteTarget(T) ⇔

```text
  T ∈ {`i8`, `i16`, `i32`, `i64`, `i128`, `u8`, `u16`, `u32`, `u64`, `u128`, `isize`, `usize`, `f16`, `f32`, `f64`} ∨
  T = TypeRawPtr(_, _) ∨
  (T = TypeArray(E, _) ∧ ValidTransmuteTarget(E)) ∨

```text
  (T = TypePath(p) ∧ RecordDecl(p) = R ∧ HasAttribute(R, `layout(C)`) ∧ ∀ f ∈ Fields(R). ValidTransmuteTarget(FieldType(R, f)))

Widen typing, warnings, and diagnostics are defined in §13.5.4 and §13.5.7.

#### 16.5.5 Dynamic Semantics

ExprType : Expr → Type

```text
R = RetType(Γ)

```text
CastValJudg = {CastVal(S, T, v) ⇓ v'}
UnsignedIntTypes = {`u8`, `u16`, `u32`, `u64`, `u128`, `usize`}
IntWidth(`i8`) = 8    IntWidth(`i16`) = 16    IntWidth(`i32`) = 32    IntWidth(`i64`) = 64    IntWidth(`i128`) = 128
IntWidth(`u8`) = 8    IntWidth(`u16`) = 16    IntWidth(`u32`) = 32    IntWidth(`u64`) = 64    IntWidth(`u128`) = 128
IntWidth(`isize`) = 8 × PointerSize    IntWidth(`usize`) = 8 × PointerSize
Mod_w(x) = x mod 2^w

```text
ToSigned(w, x) = y ⇔ y ∈ [-2^{w-1}, 2^{w-1}-1] ∧ y ≡ x mod 2^w

```text
ToUnsigned(w, x) = y ⇔ y ∈ [0, 2^w-1] ∧ y ≡ x mod 2^w
CodePoint : `char` → ℕ

```text
IsScalar(u) ⇔ u ∈ CharValueRange
IntToFloat(t, x) function
FloatToFloat(s, t, v) function
Trunc(v) function

```text
CharOf(u) = u ⇔ IsScalar(u)
CodePoint(CharOf(u)) = u    (IsScalar(u))

```text
IEEE754Bits(t, v) = bits ⇔ v ∈ FloatValueSet(t) ∧ IEEE754Encode(t, v) = bits

```text
IntToFloat(t, x) = v ⇔ v ∈ NonNaNValueSet(t) ∧ ∀ v' ∈ NonNaNValueSet(t). |v - x| < |v' - x| ∨ (|v - x| = |v' - x| ∧ EvenSignificandLSB(t, v))

```text
FloatToFloat(s, t, v) = v' ⇔ IEEE754Encode(s, v) = CanonicalNaNBits(s) ∧ v' = CanonicalNaN(t)

```text
FloatToFloat(s, t, v) = v' ⇔ IEEE754Encode(s, v) ≠ CanonicalNaNBits(s) ∧ v' ∈ NonNaNValueSet(t) ∧ ∀ u ∈ NonNaNValueSet(t). |v' - v| < |u - v| ∨ (|v' - v| = |u - v| ∧ EvenSignificandLSB(t, v'))
Trunc(v) =

```text
 ⌊v⌋    if v ≥ 0
 ⌈v⌉    if v < 0

**(CastVal-Id)**
StripPerm(S) = StripPerm(T)
────────────────────────────────────────

```text
CastVal(S, T, v) ⇓ v

**(CastVal-Int-Int-Signed)**

```text
S' = StripPerm(S)    T' = StripPerm(T)    S' = TypePrim(s)    T' = TypePrim(t)    s ∈ IntTypes    t ∈ SignedIntTypes    v = IntVal(s, x)    w = IntWidth(t)    x' = ToSigned(w, x)    v' = IntVal(t, x')
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
CastVal(S, T, v) ⇓ v'

**(CastVal-Int-Int-Unsigned)**

```text
S' = StripPerm(S)    T' = StripPerm(T)    S' = TypePrim(s)    T' = TypePrim(t)    s ∈ IntTypes    t ∈ UnsignedIntTypes    v = IntVal(s, x)    w = IntWidth(t)    x' = ToUnsigned(w, x)    v' = IntVal(t, x')
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
CastVal(S, T, v) ⇓ v'

**(CastVal-Int-Float)**

```text
S' = StripPerm(S)    T' = StripPerm(T)    S' = TypePrim(s)    T' = TypePrim(t)    s ∈ IntTypes    t ∈ FloatTypes    v = IntVal(s, x)    v' = FloatVal(t, IntToFloat(t, x))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
CastVal(S, T, v) ⇓ v'

```text
Lowering and backend emission for `CastVal-Int-Float` MUST preserve source signedness: use signed integer-to-float conversion iff `s ∈ SignedIntTypes`; otherwise use unsigned conversion.

**(CastVal-Float-Float)**

```text
S' = StripPerm(S)    T' = StripPerm(T)    S' = TypePrim(s)    T' = TypePrim(t)    s ∈ FloatTypes    t ∈ FloatTypes    v = FloatVal(s, x)    v' = FloatVal(t, FloatToFloat(s, t, x))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
CastVal(S, T, v) ⇓ v'

**(CastVal-Float-Int)**

```text
S' = StripPerm(S)    T' = StripPerm(T)    S' = TypePrim(s)    T' = TypePrim(t)    s ∈ FloatTypes    t ∈ IntTypes    v = FloatVal(s, x)    x' = Trunc(x)    InRange(x', t)    v' = IntVal(t, x')
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
CastVal(S, T, v) ⇓ v'

**(CastVal-Bool-Int)**

```text
S' = StripPerm(S)    T' = StripPerm(T)    S' = TypePrim("bool")    T' = TypePrim(t)    t ∈ IntTypes    v' =
 IntVal(t, 0)    if v = false
 IntVal(t, 1)    if v = true
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
CastVal(S, T, v) ⇓ v'

**(CastVal-Int-Bool)**

```text
S' = StripPerm(S)    T' = StripPerm(T)    S' = TypePrim(t)    t ∈ IntTypes    T' = TypePrim("bool")    v = IntVal(t, x)    v' =
 false    if x = 0

```text
 true     if x ≠ 0
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
CastVal(S, T, v) ⇓ v'

**(CastVal-Char-U32)**
S' = StripPerm(S)    T' = StripPerm(T)    S' = TypePrim("char")    T' = TypePrim("u32")    v' = IntVal("u32", CodePoint(v))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
CastVal(S, T, v) ⇓ v'

**(CastVal-U32-Char)**
S' = StripPerm(S)    T' = StripPerm(T)    S' = TypePrim("u32")    T' = TypePrim("char")    v = IntVal("u32", x)    IsScalar(x)    v' = CharVal(CharOf(x))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
CastVal(S, T, v) ⇓ v'

**(EvalSigma-Cast)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    S = ExprType(e)    CastVal(S, T, v) ⇓ v'
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Cast(e, T), σ) ⇓ (Val(v'), σ_1)

**(EvalSigma-Cast-Panic)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    S = ExprType(e)    CastVal(S, T, v) undefined
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Cast(e, T), σ) ⇓ (Ctrl(Panic), σ_1)

```text
TransmuteVal(S, T, v) ⇓ v' ⇔ ValueBits(S, v) = bits ∧ ValueBits(T, v') = bits

**(EvalSigma-Transmute)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    S = t_1    T = t_2    TransmuteVal(S, T, v) ⇓ v'
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(TransmuteExpr(t_1, t_2, e), σ) ⇓ (Val(v'), σ_1)

**(EvalSigma-Transmute-Ctrl)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Ctrl(κ), σ_1)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(TransmuteExpr(t_1, t_2, e), σ) ⇓ (Ctrl(κ), σ_1)

`widen` dynamic semantics are defined in §13.5.5.

#### 16.5.6 Lowering

**(Lower-Expr-Cast)**

```text
Γ ⊢ LowerCast(e, T) ⇓ ⟨IR, v⟩
───────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Cast(e, T)) ⇓ ⟨IR, v⟩

**(Lower-Expr-Transmute)**

```text
Γ ⊢ LowerTransmute(T_1, T_2, e) ⇓ ⟨IR, v⟩
────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(TransmuteExpr(T_1, T_2, e)) ⇓ ⟨IR, v⟩

`Lower-Cast`, `Lower-Cast-Panic`, `Lower-Transmute`, and `Lower-Transmute-Err` define the runtime bit reinterpretation and panic behavior. `widen` lowering is defined in §13.5.6.

#### 16.5.7 Diagnostics

Diagnostics are defined for invalid casts, `transmute` outside `unsafe`, `transmute` source/target size mismatch, `transmute` source/target alignment mismatch, and targets with known invalid bit patterns. `widen`-specific diagnostics remain owned by §13.5.7.

### 16.6 Construction Expressions

#### 16.6.1 Syntax

```text
```

tuple_literal       ::= "(" tuple_expr_elements? ")"
tuple_expr_elements ::= expression ";" | expression ("," expression)+
array_literal       ::= "[" array_segment_list? "]"
array_segment_list  ::= array_segment ("," array_segment)*
array_segment       ::= expression | expression ";" expression
record_literal      ::= identifier "{" field_init_list "}" | state_specific_type "{" field_init_list? "}"
field_init_list     ::= field_init ("," field_init)*
field_init          ::= identifier ":" expression | identifier
```

Unit enum constructors and tuple/record enum constructors arise after name resolution from qualified forms. Zero-argument record default construction uses ordinary call syntax and is specified in this section.

#### 16.6.2 Parsing

**(Parse-Tuple-Literal)**

```text
IsPunc(Tok(P), "(")    TupleParen(P)    Γ ⊢ ParseTupleExprElems(Advance(P)) ⇓ (P_1, elems)    IsPunc(Tok(P_1), ")")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_1), TupleExpr(elems))

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

**(Parse-Record-Literal-ModalState)**

```text
Γ ⊢ ParseModalTypeRef(P) ⇓ (P_1, modal_ref)    IsOp(Tok(P_1), "@")    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, state)    IsPunc(Tok(P_2), "{")    Γ ⊢ ParseFieldInitList(Advance(P_2)) ⇓ (P_3, fields)    IsPunc(Tok(P_3), "}")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_3), RecordExpr(ModalStateRef(modal_ref, state), fields))

**(Parse-Record-Literal)**

```text
Γ ⊢ ParseTypePath(P) ⇓ (P_1, path)    |path| = 1    IsPunc(Tok(P_1), "{")    Γ ⊢ ParseFieldInitList(Advance(P_1)) ⇓ (P_2, fields)    fields ≠ []    IsPunc(Tok(P_2), "}")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_2), RecordExpr(TypePath(path), fields))

**(Parse-Qualified-Apply-Brace)**

```text
Γ ⊢ ParseQualifiedHead(P) ⇓ (P_1, path, name)    IsPunc(Tok(P_1), "{")    Γ ⊢ ParseFieldInitList(Advance(P_1)) ⇓ (P_2, fields)    fields ≠ []    IsPunc(Tok(P_2), "}")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_2), QualifiedApply(path, name, Brace(fields)))

**(Parse-TupleExprElems-Empty)**, **(Parse-TupleExprElems-Single)**, **(Parse-TupleExprElems-Many)**, **(Parse-ExprList-Cons)**, **(Parse-ExprList-Empty)**, **(Parse-ExprListTail-End)**, **(Parse-ExprListTail-TrailingComma)**, **(Parse-ExprListTail-Comma)**, **(Parse-FieldInitList-Empty)**, **(Parse-FieldInitList-Cons)**, **(Parse-FieldInit-Explicit)**, **(Parse-FieldInit-Shorthand)**, **(Parse-FieldInitTail-End)**, **(Parse-FieldInitTail-TrailingComma)**, and **(Parse-FieldInitTail-Comma)** define the list and shorthand parsing behavior.

#### 16.6.3 AST Representation / Form

```text
FieldInit = ⟨name, expr⟩

Expr = TupleExpr(elems) | ArrayExpr(segments) | RecordExpr(type_ref, fields) | EnumLiteral(path, payload_opt) | QualifiedApply(path, name, Brace(fields)) | …

```text
FieldInitNames(fields) = [ f | ⟨f, _⟩ ∈ fields ]

```text
FieldInitSet(fields) = { x | x ∈ FieldInitNames(fields) }

Qualified brace applications are pre-resolution forms. After name resolution they become:

- `RecordExpr(TypePath(p), fields')`
- `EnumLiteral(FullPath(p, name), Brace(fields'))`

Qualified parenthesized applications become tuple-enum construction or ordinary calls as determined by name resolution.

#### 16.6.4 Static Semantics

**(T-Unit-Literal)**
────────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleExpr([]) : TypePrim(`()`)

**(T-Tuple-Literal)**

```text
n ≥ 1    ∀ i, Γ ⊢ e_i : T_i
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleExpr([e_1, …, e_n]) : TypeTuple([T_1, …, T_n])

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


```text
FieldNames(R) = [ f.name | f ∈ Fields(R) ]

```text
FieldNameSet(R) = { x | x ∈ FieldNames(R) }

**(T-Record-Literal)**

```text
RecordDecl(p) = R    Distinct(FieldInitNames(fields))    FieldInitSet(fields) = FieldNameSet(R)    ∀ ⟨f, e⟩ ∈ fields, FieldType(R, f) = T_f ∧ FieldVisible(m, R, f) ∧ Γ; R; L ⊢ e ⇐ T_f ⊣ ∅
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ RecordExpr(TypePath(p), fields) : TypePath(p)

**(Record-FieldInit-Dup)**
RecordDecl(p) = R    ¬ Distinct(FieldInitNames(fields))    c = Code(Record-FieldInit-Dup)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ RecordExpr(TypePath(p), fields) ⇑ c

**(Record-FieldInit-Missing)**

```text
RecordDecl(p) = R    FieldInitSet(fields) ≠ FieldNameSet(R)    c = Code(Record-FieldInit-Missing)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ RecordExpr(TypePath(p), fields) ⇑ c

**(Record-Field-Unknown)** and **(Record-Field-NotVisible)** reject unknown or inaccessible record fields.

**(Record-Field-NonBitcopy-Move)**

```text
RecordDecl(p) = R    ∃ ⟨f, e⟩ ∈ fields. FieldType(R, f) = T_f ∧ ¬ BitcopyType(T_f) ∧ IsPlace(e) ∧ e ≠ MoveExpr(_)    c = Code(Record-Field-NonBitcopy-Move)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ RecordExpr(TypePath(p), fields) ⇑ c

**(T-Enum-Lit-Unit)**, **(T-Enum-Lit-Tuple)**, and **(T-Enum-Lit-Record)** type unit, tuple-payload, and record-payload enum constructors after name resolution has identified the target variant and payload shape.

```text
RecordCallee(callee) = R ⇔ (callee = Identifier(name) ∨ callee = Path(path, name)) ∧ Γ ⊢ ResolveTypeName(name) ⇓ ent ∧ ent.origin_opt = mp ∧ name' = (ent.target_opt if present, else name) ∧ RecordDecl(FullPath(PathOfModule(mp), name')) = R

```text
DefaultConstructible(R) ⇔ ∀ f ∈ Fields(R). f.init_opt ≠ ⊥

**(T-Record-Default)**

```text
RecordCallee(callee) = R    Γ ⊢ R record wf    DefaultConstructible(R)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Call(callee, []) : TypePath(RecordPath(R))

**(Record-Default-Init-Err)**
RecordCallee(callee) = R    ¬ DefaultConstructible(R)    c = Code(Record-Default-Init-Err)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Call(callee, []) ⇑ c

#### 16.6.5 Dynamic Semantics

**(EvalSigma-Tuple)** and **(EvalSigma-Tuple-Ctrl)** evaluate tuple elements left to right and produce tuple values.

**(EvalSigma-Array)** and **(EvalSigma-Array-Ctrl)** evaluate array elements left to right and produce array values.

**(EvalSigma-Record)** and **(EvalSigma-Record-Ctrl)** evaluate record field initializers left to right and produce `RecordValue`.

**(EvalSigma-Enum-Unit)**, **(EvalSigma-Enum-Tuple)**, **(EvalSigma-Enum-Tuple-Ctrl)**, **(EvalSigma-Enum-Record)**, and **(EvalSigma-Enum-Record-Ctrl)** evaluate enum payloads and construct `EnumValue`.

Zero-argument default record construction uses `EvalSigma-Call-Record` from §16.3.5.

#### 16.6.6 Lowering

**(Lower-Expr-Tuple)**

```text
Γ ⊢ LowerList(es) ⇓ ⟨IR, vec_v⟩
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(TupleExpr(es)) ⇓ ⟨IR, (v_1, …, v_n)⟩

**(Lower-Expr-Array)**

```text
Γ ⊢ LowerArraySegments(segs) ⇓ ⟨IR, vec_v⟩
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(ArrayExpr(segs)) ⇓ ⟨IR, [v_1, …, v_n]⟩

**(Lower-Expr-Record)**

```text
Γ ⊢ LowerFieldInits(fields) ⇓ ⟨IR, vec_f⟩
─────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(RecordExpr(tr, fields)) ⇓ ⟨IR, RecordValue(tr, vec_f)⟩

**(Lower-Expr-Enum-Unit)**, **(Lower-Expr-Enum-Tuple)**, and **(Lower-Expr-Enum-Record)** lower the three enum-construction forms.

**(Lower-CallIR-RecordCtor)**

```text
CallTarget(callee) = RecordCtor(p)    args = []    RecordDefaultInits(p) = fields    Γ ⊢ LowerFieldInits(fields) ⇓ ⟨IR_f, vec_f⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(CallIR(callee, args)) ⇓ ⟨IR_f, RecordValue(TypePath(p), vec_f)⟩

#### 16.6.7 Diagnostics

Diagnostics are defined for duplicate record-field initializers, missing record-field initializers, unknown or inaccessible record fields, non-`move` construction from non-`Bitcopy` place expressions, unresolved qualified brace constructors, and zero-argument record construction when some fields lack defaults.

### 16.7 Control Expressions

#### 16.7.1 Syntax

```text
```

if_expr        ::= "if" expression if_tail
if_tail        ::= block_expr ("else" (block_expr | if_expr))?
                 | "is" pattern block_expr ("else" (block_expr | if_expr))?
                 | "is" "{" if_case+ if_case_else? "}"
if_case        ::= pattern block_expr
if_case_else   ::= "else" block_expr
loop_expr      ::= "loop" loop_condition? loop_invariant? block_expr
loop_condition ::= expression | pattern (":" type)? "in" expression
loop_invariant ::= "|:" "{" predicate_expr "}"
block_expr     ::= "{" statement* expression? "}"
```

Pattern forms, case-clause parsing, and exhaustiveness notions are owned by Chapter 17. Loop-invariant obligations are owned by §15.7.
Block structure, statement sequencing, terminator handling, and block-local typing are owned by §18.1.

#### 16.7.2 Parsing

**(Parse-If-Expr)**

```text
IsKw(Tok(P), `if`)    Γ ⊢ ParseExpr_NoBrace(Advance(P)) ⇓ (P_1, c)    ¬ IsKw(Tok(P_1), `is`)    Γ ⊢ ParseBlock(P_1) ⇓ (P_2, b1)    Γ ⊢ ParseElseOpt(P_2) ⇓ (P_3, b2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (P_3, IfExpr(c, b1, b2))

**(Parse-If-Is-Single)**

```text
IsKw(Tok(P), `if`)    Γ ⊢ ParseExpr_NoBrace(Advance(P)) ⇓ (P_1, e)    IsKw(Tok(P_1), `is`)    ¬ IsPunc(Tok(Advance(P_1)), "{")    Γ ⊢ ParsePattern(Advance(P_1)) ⇓ (P_2, pat)    Γ ⊢ ParseBlock(P_2) ⇓ (P_3, b1)    Γ ⊢ ParseElseOpt(P_3) ⇓ (P_4, b2)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (P_4, IfIsExpr(e, pat, b1, b2))

**(Parse-If-Is-CaseList)**

```text
IsKw(Tok(P), `if`)    Γ ⊢ ParseExpr_NoBrace(Advance(P)) ⇓ (P_1, e)    IsKw(Tok(P_1), `is`)    IsPunc(Tok(Advance(P_1)), "{")    Γ ⊢ ParseIfCases(Advance(Advance(P_1))) ⇓ (P_2, cases, else_opt)    IsPunc(Tok(P_2), "}")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_2), IfCaseExpr(e, cases, else_opt))

**(Parse-Loop-Expr)**

```text
IsKw(Tok(P), `loop`)    Γ ⊢ ParseLoopTail(Advance(P)) ⇓ (P_1, loop)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (P_1, loop)

**(Parse-Block-Expr)**

```text
IsPunc(Tok(P), "{")    Γ ⊢ ParseBlock(P) ⇓ (P_1, b)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (P_1, b)

**(Parse-IfCases-Cons)**, **(Parse-IfCase)**, **(Parse-IfCasesTail-End)**, **(Parse-IfCasesTail-Else)**, **(Parse-IfCasesTail-Cons)**, **(Parse-LoopTail-Infinite)**, **(Parse-LoopTail-Iter)**, **(Parse-LoopTail-Cond)**, **(TryParsePatternIn-Ok)**, **(TryParsePatternIn-Fail)**, **(Parse-ElseOpt-None)**, **(Parse-ElseOpt-If)**, and **(Parse-ElseOpt-Block)** define the remaining control-expression parsing details.

#### 16.7.3 AST Representation / Form

Expr = IfExpr(cond, then_block, else_opt) | IfIsExpr(scrutinee, pattern, then_block, else_opt) | IfCaseExpr(scrutinee, cases, else_opt) | LoopInfinite(inv_opt, body) | LoopConditional(cond, inv_opt, body) | LoopIter(pattern, type_opt, iter, inv_opt, body) | BlockExpr(stmts, tail_opt) | …

```text
LoopInvariantOpt ∈ {⊥} ∪ Expr

```text
IfCase = ⟨pattern, body⟩

LoopTypeInf(Brk, BrkVoid) =
  { TypePrim(`!`)    if Brk = [] ∧ BrkVoid = false
    TypePrim(`()`)   if Brk = [] ∧ BrkVoid = true
    T                if BrkVoid = false ∧ ResType(Brk) = T

```text
    ⊥                otherwise }

LoopTypeFin(Brk, BrkVoid) =
  { TypePrim(`()`)   if Brk = []
    T                if BrkVoid = false ∧ ResType(Brk) = T

```text
    ⊥                otherwise }

#### 16.7.4 Static Semantics

Block typing and checking are owned by §18.1.4:

- `BlockInfo(BlockExpr(stmts, tail_opt)) ⇓ ⟨T, Brk, BrkVoid⟩`
- `T-Block`
- `Chk-Block-Tail`
- `Chk-Block-Return`
- `Chk-Block-Unit`

**(T-If)**

```text
Γ; R; L ⊢ c : TypePrim(`bool`)    Γ; R; L ⊢ b_t : T    Γ; R; L ⊢ b_f : T
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfExpr(c, b_t, b_f) : T

**(T-If-No-Else)**

```text
Γ; R; L ⊢ c : TypePrim(`bool`)    Γ; R; L ⊢ b_t : TypePrim(`()`)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfExpr(c, b_t, ⊥) : TypePrim(`()`)

**(Chk-If)** and **(Chk-If-No-Else)** define checking-mode validation for the same two forms.

Pattern typing uses Chapter 17 pattern judgments:

- `Γ ⊢ pat ◁ T ⊣ B` for case binding
- `CaseScope(Γ, e, pat, T)` for pattern bindings and scrutinee narrowing
- `HasIrrefutableCase(cases, T)` and the exhaustiveness conditions from §17.6

**(T-If-Is)**

```text
Γ; R; L ⊢ e : T_s    CaseScope(Γ, e, pat, T_s) ⇓ Γ_1    Γ_1; R; L ⊢ b_t : T    Γ; R; L ⊢ b_f : T
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfIsExpr(e, pat, b_t, b_f) : T

**(T-If-Is-No-Else)**

```text
Γ; R; L ⊢ e : T_s    CaseScope(Γ, e, pat, T_s) ⇓ Γ_1    Γ_1; R; L ⊢ b_t : TypePrim(`()`)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfIsExpr(e, pat, b_t, ⊥) : TypePrim(`()`)

`T-IfCase-Other` types case analysis when all case bodies synthesize the same type and the case set is exhaustive or a fallback block is present. `T-IfCase-Enum`, `T-IfCase-Modal`, and `T-IfCase-Union` are the specialized forms for enum, modal, and union scrutinees.

**(Chk-IfIs)** and **(Chk-IfIs-No-Else)** define checking-mode validation for single-case `if ... is ...`.
**(Chk-IfCase-Other)**, **(Chk-IfCase-Enum)**, **(Chk-IfCase-Modal)**, and **(Chk-IfCase-Union)** define checking-mode validation for `if ... is { ... }`.

Loop invariants use `LoopInvOk` from §15.7.4.

**(T-Loop-Infinite)**

```text
LoopInvOk(inv_opt)    Γ; R; `loop` ⊢ BlockInfo(body) ⇓ ⟨T_b, Brk, BrkVoid⟩    LoopTypeInf(Brk, BrkVoid) = T
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopInfinite(inv_opt, body) : T

**(T-Loop-Conditional)**

```text
Γ; R; L ⊢ cond : TypePrim(`bool`)    LoopInvOk(inv_opt)    Γ; R; `loop` ⊢ BlockInfo(body) ⇓ ⟨T_b, Brk, BrkVoid⟩    LoopTypeFin(Brk, BrkVoid) = T
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopConditional(cond, inv_opt, body) : T

**(T-Loop-Iter)**

```text
(Γ; R; L ⊢ iter : T_iter)    LoopIterableType(T_iter, T)    (RangeLoopType(T_iter, T) ⇒ ImplementsStep(T))    (BoundedRangeLoopType(T_iter, T) ⇒ ImplementsEq(T))    (ty_opt = ⊥ ⇒ T_p = T)    (ty_opt = T_a ⇒ Γ ⊢ T <: T_a ∧ T_p = T_a)    Γ ⊢ pat ⇐ T_p ⊣ B    Distinct(PatNames(pat))    LoopInvOk(inv_opt)    Γ_0 = PushScope(Γ)    IntroAll(Γ_0, B) ⇓ Γ_1    Γ_1; R; `loop` ⊢ BlockInfo(body) ⇓ ⟨T_b, Brk, BrkVoid⟩    LoopTypeFin(Brk, BrkVoid) = T_r
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopIter(pat, ty_opt, iter, inv_opt, body) : T_r

**(T-Loop-Iter-Async)** and **(Loop-Async-Err)** define the async-iterator case and its rejection when the enclosing return type is not compatible. Async-specific composition semantics remain in Chapter 21.

#### 16.7.5 Dynamic Semantics

**(EvalSigma-If-True)**

```text
Γ ⊢ EvalSigma(cond, σ) ⇓ (Val(true), σ_1)    Γ ⊢ EvalSigma(then_block, σ_1) ⇓ (out, σ_2)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IfExpr(cond, then_block, else_opt), σ) ⇓ (out, σ_2)

**(EvalSigma-If-False-None)**

```text
Γ ⊢ EvalSigma(cond, σ) ⇓ (Val(false), σ_1)    else_opt = ⊥
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IfExpr(cond, then_block, else_opt), σ) ⇓ (Val(()), σ_1)

**(EvalSigma-If-False-Some)**

```text
Γ ⊢ EvalSigma(cond, σ) ⇓ (Val(false), σ_1)    else_opt = e    Γ ⊢ EvalSigma(e, σ_1) ⇓ (out, σ_2)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IfExpr(cond, then_block, else_opt), σ) ⇓ (out, σ_2)

**(EvalSigma-If-Ctrl)**

```text
Γ ⊢ EvalSigma(cond, σ) ⇓ (Ctrl(κ), σ_1)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IfExpr(cond, then_block, else_opt), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-If-Is)**

```text
Γ ⊢ EvalSigma(scrutinee, σ) ⇓ (Val(v_s), σ_1)    Γ ⊢ EvalIfCaseListSigma([⟨pat, then_block⟩], else_opt, v_s, σ_1) ⇓ (out, σ_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IfIsExpr(scrutinee, pat, then_block, else_opt), σ) ⇓ (out, σ_2)

**(EvalSigma-If-Is-Ctrl)**

```text
Γ ⊢ EvalSigma(scrutinee, σ) ⇓ (Ctrl(κ), σ_1)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IfIsExpr(scrutinee, pat, then_block, else_opt), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-If-Cases)**

```text
Γ ⊢ EvalSigma(scrutinee, σ) ⇓ (Val(v_s), σ_1)    Γ ⊢ EvalIfCaseListSigma(cases, else_opt, v_s, σ_1) ⇓ (out, σ_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IfCaseExpr(scrutinee, cases, else_opt), σ) ⇓ (out, σ_2)

**(EvalSigma-If-Cases-Ctrl)**

```text
Γ ⊢ EvalSigma(scrutinee, σ) ⇓ (Ctrl(κ), σ_1)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(IfCaseExpr(scrutinee, cases, else_opt), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalIfCase-Fail)**, **(EvalIfCase-Hit)**, **(EvalIfCases-Head)**, **(EvalIfCases-Tail)**, **(EvalIfCases-Else)**, and **(EvalIfCases-None)** define left-to-right matching of case clauses against the scrutinee.

**(EvalSigma-Block)**

```text
Γ ⊢ EvalBlockSigma(BlockExpr(stmts, tail_opt), σ) ⇓ (out, σ')
──────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(BlockExpr(stmts, tail_opt), σ) ⇓ (out, σ')

```text
LoopIterableType(T_iter, T) ⇔ T_iter = TypeSlice(T) ∨ T_iter = TypeArray(T, n) ∨ T_iter = TypeRange(T) ∨ T_iter = TypeRangeInclusive(T) ∨ T_iter = TypeRangeFrom(T)

```text
LoopIterableType(TypePerm(p, T_iter), T) ⇔ LoopIterableType(T_iter, T)

```text
RangeLoopType(T_iter, T) ⇔ T_iter = TypeRange(T) ∨ T_iter = TypeRangeInclusive(T) ∨ T_iter = TypeRangeFrom(T)

```text
RangeLoopType(TypePerm(p, T_iter), T) ⇔ RangeLoopType(T_iter, T)

```text
BoundedRangeLoopType(T_iter, T) ⇔ T_iter = TypeRange(T) ∨ T_iter = TypeRangeInclusive(T)

```text
BoundedRangeLoopType(TypePerm(p, T_iter), T) ⇔ BoundedRangeLoopType(T_iter, T)

```text
IterJudg = {IterInit(v) ⇓ it, IterNext(it) ⇓ (opt(v), it')}

```text
Iter = {SeqIter(v, i) | Len(v) defined ∧ i ∈ ℕ} ∪ {RangeIterExclusive(cur, hi)} ∪ {RangeIterInclusive(cur, hi)} ∪ {RangeIterFrom(cur)} ∪ {IterDone}

```text
Successor(v) ⇓ v' ⇔ `Step::successor` applied to v returns v'

```text
EqHolds(v_1, v_2) ⇔ `Eq::eq` applied to ⟨v_1, v_2⟩ returns `true`

```text
IterInit(v) ⇓ SeqIter(v, 0) ⇔ Len(v) defined

```text
IterInit(RangeVal(`Exclusive`, lo, hi)) ⇓ RangeIterExclusive(lo, hi)

```text
IterInit(RangeVal(`Inclusive`, lo, hi)) ⇓ RangeIterInclusive(lo, hi)

```text
IterInit(RangeVal(`From`, lo, ⊥)) ⇓ RangeIterFrom(lo)

```text
IterNext(SeqIter(v, i)) ⇓ (⊥, IterDone) ⇔ ¬ (0 ≤ i < Len(v))

```text
IterNext(SeqIter(v, i)) ⇓ (v_i, SeqIter(v, i + 1)) ⇔ 0 ≤ i < Len(v) ∧ IndexValue(v, i) = v_i

```text
IterNext(RangeIterExclusive(cur, hi)) ⇓ (⊥, IterDone) ⇔ EqHolds(cur, hi)

```text
IterNext(RangeIterExclusive(cur, hi)) ⇓ (cur, RangeIterExclusive(cur', hi)) ⇔ ¬ EqHolds(cur, hi) ∧ Successor(cur) ⇓ cur'

```text
IterNext(RangeIterExclusive(cur, hi)) ⇓ (cur, IterDone) ⇔ ¬ EqHolds(cur, hi) ∧ ¬ ∃ cur'. Successor(cur) ⇓ cur'

```text
IterNext(RangeIterInclusive(cur, hi)) ⇓ (cur, IterDone) ⇔ EqHolds(cur, hi)

```text
IterNext(RangeIterInclusive(cur, hi)) ⇓ (cur, RangeIterInclusive(cur', hi)) ⇔ ¬ EqHolds(cur, hi) ∧ Successor(cur) ⇓ cur'

```text
IterNext(RangeIterInclusive(cur, hi)) ⇓ (cur, IterDone) ⇔ ¬ EqHolds(cur, hi) ∧ ¬ ∃ cur'. Successor(cur) ⇓ cur'

```text
IterNext(RangeIterFrom(cur)) ⇓ (cur, RangeIterFrom(cur')) ⇔ Successor(cur) ⇓ cur'

```text
IterNext(RangeIterFrom(cur)) ⇓ (cur, IterDone) ⇔ ¬ ∃ cur'. Successor(cur) ⇓ cur'

```text
IterNext(IterDone) ⇓ (⊥, IterDone)

```text
LoopIterJudg = {Γ ⊢ LoopIterExec(pat, body, it, σ) ⇓ (out, σ')}

**(EvalSigma-Loop-Infinite-Step)**

```text
Γ ⊢ EvalSigma(body, σ) ⇓ (Val(v), σ_1)    Γ ⊢ EvalSigma(LoopInfinite(inv_opt, body), σ_1) ⇓ (out, σ_2)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(LoopInfinite(inv_opt, body), σ) ⇓ (out, σ_2)

**(EvalSigma-Loop-Infinite-Continue)**

```text
Γ ⊢ EvalSigma(body, σ) ⇓ (Ctrl(Continue), σ_1)    Γ ⊢ EvalSigma(LoopInfinite(inv_opt, body), σ_1) ⇓ (out, σ_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(LoopInfinite(inv_opt, body), σ) ⇓ (out, σ_2)

**(EvalSigma-Loop-Infinite-Break)**

```text
Γ ⊢ EvalSigma(body, σ) ⇓ (Ctrl(Break(v_opt)), σ_1)    v = BreakVal(v_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(LoopInfinite(inv_opt, body), σ) ⇓ (Val(v), σ_1)

**(EvalSigma-Loop-Infinite-Ctrl)**

```text
Γ ⊢ EvalSigma(body, σ) ⇓ (Ctrl(κ), σ_1)    κ ∈ {Return(_), Panic, Abort}
─────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(LoopInfinite(inv_opt, body), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-Loop-Cond-False)**

```text
Γ ⊢ EvalSigma(cond, σ) ⇓ (Val(false), σ_1)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(LoopConditional(cond, inv_opt, body), σ) ⇓ (Val(()), σ_1)

**(EvalSigma-Loop-Cond-True-Step)**

```text
Γ ⊢ EvalSigma(cond, σ) ⇓ (Val(true), σ_1)    Γ ⊢ EvalSigma(body, σ_1) ⇓ (Val(v), σ_2)    Γ ⊢ EvalSigma(LoopConditional(cond, inv_opt, body), σ_2) ⇓ (out, σ_3)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(LoopConditional(cond, inv_opt, body), σ) ⇓ (out, σ_3)

**(EvalSigma-Loop-Cond-Continue)**

```text
Γ ⊢ EvalSigma(cond, σ) ⇓ (Val(true), σ_1)    Γ ⊢ EvalSigma(body, σ_1) ⇓ (Ctrl(Continue), σ_2)    Γ ⊢ EvalSigma(LoopConditional(cond, inv_opt, body), σ_2) ⇓ (out, σ_3)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(LoopConditional(cond, inv_opt, body), σ) ⇓ (out, σ_3)

**(EvalSigma-Loop-Cond-Break)**

```text
Γ ⊢ EvalSigma(cond, σ) ⇓ (Val(true), σ_1)    Γ ⊢ EvalSigma(body, σ_1) ⇓ (Ctrl(Break(v_opt)), σ_2)    v = BreakVal(v_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(LoopConditional(cond, inv_opt, body), σ) ⇓ (Val(v), σ_2)

**(EvalSigma-Loop-Cond-Ctrl)**

```text
Γ ⊢ EvalSigma(cond, σ) ⇓ (Ctrl(κ), σ_1)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(LoopConditional(cond, inv_opt, body), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-Loop-Cond-Body-Ctrl)**

```text
Γ ⊢ EvalSigma(cond, σ) ⇓ (Val(true), σ_1)    Γ ⊢ EvalSigma(body, σ_1) ⇓ (Ctrl(κ), σ_2)    κ ∈ {Return(_), Panic, Abort}
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(LoopConditional(cond, inv_opt, body), σ) ⇓ (Ctrl(κ), σ_2)

**(EvalSigma-Loop-Iter)**

```text
Γ ⊢ EvalSigma(iter, σ) ⇓ (Val(v_iter), σ_1)    IterInit(v_iter) ⇓ it    Γ ⊢ LoopIterExec(pat, body, it, σ_1) ⇓ (out, σ_2)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(LoopIter(pat, ty_opt, iter, inv_opt, body), σ) ⇓ (out, σ_2)

**(EvalSigma-Loop-Iter-Ctrl)**

```text
Γ ⊢ EvalSigma(iter, σ) ⇓ (Ctrl(κ), σ_1)
───────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(LoopIter(pat, ty_opt, iter, inv_opt, body), σ) ⇓ (Ctrl(κ), σ_1)

**(LoopIter-Done)**

```text
IterNext(it) ⇓ (⊥, it')
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopIterExec(pat, body, it, σ) ⇓ (Val(()), σ)

**(LoopIter-Step-Val)**

```text
IterNext(it) ⇓ (v, it')    Γ ⊢ EvalBlockBindSigma(pat, v, body, σ) ⇓ (Val(v_b), σ_1)    Γ ⊢ LoopIterExec(pat, body, it', σ_1) ⇓ (out, σ_2)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopIterExec(pat, body, it, σ) ⇓ (out, σ_2)

**(LoopIter-Step-Continue)**

```text
IterNext(it) ⇓ (v, it')    Γ ⊢ EvalBlockBindSigma(pat, v, body, σ) ⇓ (Ctrl(Continue), σ_1)    Γ ⊢ LoopIterExec(pat, body, it', σ_1) ⇓ (out, σ_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopIterExec(pat, body, it, σ) ⇓ (out, σ_2)

**(LoopIter-Step-Break)**

```text
IterNext(it) ⇓ (v, it')    Γ ⊢ EvalBlockBindSigma(pat, v, body, σ) ⇓ (Ctrl(Break(v_opt)), σ_1)    v' = BreakVal(v_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopIterExec(pat, body, it, σ) ⇓ (Val(v'), σ_1)

**(LoopIter-Step-Ctrl)**

```text
IterNext(it) ⇓ (v, it')    Γ ⊢ EvalBlockBindSigma(pat, v, body, σ) ⇓ (Ctrl(κ), σ_1)    κ ∈ {Return(_), Panic, Abort}
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopIterExec(pat, body, it, σ) ⇓ (Ctrl(κ), σ_1)

#### 16.7.6 Lowering

**(Lower-Expr-If)**

```text
Γ ⊢ LowerExpr(cond) ⇓ ⟨IR_c, v_c⟩    Γ ⊢ LowerBlock(b_1) ⇓ ⟨IR_1, v_1⟩    Γ ⊢ LowerBlock(b_2) ⇓ ⟨IR_2, v_2⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(IfExpr(cond, b_1, b_2)) ⇓ ⟨SeqIR(IR_c, IfIR(v_c, IR_1, v_1, IR_2, v_2)), v_if⟩

**(Lower-Expr-If-Is)**

```text
Γ ⊢ LowerIfCases(scrut, [⟨pat, b_t⟩], else_opt) ⇓ ⟨IR, v⟩
──────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(IfIsExpr(scrut, pat, b_t, else_opt)) ⇓ ⟨IR, v⟩

**(Lower-Expr-If-Cases)**

```text
Γ ⊢ LowerIfCases(scrut, cases, else_opt) ⇓ ⟨IR, v⟩
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(IfCaseExpr(scrut, cases, else_opt)) ⇓ ⟨IR, v⟩

**(Lower-Expr-LoopInf)**, **(Lower-Expr-LoopCond)**, and **(Lower-Expr-LoopIter)** delegate to `LowerLoop`.

**(Lower-Expr-Block)**

```text
Γ ⊢ LowerBlock(BlockExpr(stmts, tail_opt)) ⇓ ⟨IR, v⟩
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(BlockExpr(stmts, tail_opt)) ⇓ ⟨IR, v⟩

`LowerBlock`, `Lower-Block-Tail`, and `Lower-Block-Unit` are owned by §18.1.6. **(Lower-Loop-Infinite)**, **(Lower-Loop-Cond)**, and **(Lower-Loop-Iter)** define loop lowering. **(Lower-IfCases)** lowers case-analysis scrutinee evaluation to `IfCaseIR`.

#### 16.7.7 Diagnostics

Diagnostics are defined for non-`bool` `if` and conditional-loop conditions, ill-typed `if ... is` case bodies, ill-typed loop iterators, and async iterator loops that violate the enclosing async return/error constraints.

Pattern exhaustiveness and reachability diagnostics for `if ... is { ... }` are owned by §17.6. Loop-invariant diagnostics are owned by §15.7.
Block-expression parse, terminator, and result-join diagnostics are owned by §18.1.7.

### 16.8 Effectful Core Expressions

#### 16.8.1 Syntax

```text
```

unsafe_expr     ::= "unsafe" block_expr
address_of_expr ::= "&" place_expr
move_expr       ::= "move" place_expr
deref_expr      ::= "*" unary_expr
alloc_expr      ::= "^" expression
propagate_expr  ::= postfix_expr "?"
```

After name resolution, `Binary("^", Identifier(r), e)` MAY be rewritten to `AllocExpr(r, e)` when `r` is a region alias.

#### 16.8.2 Parsing

**(Parse-Unary-Deref)**

```text
IsOp(Tok(P), "*")    Γ ⊢ ParseUnary(Advance(P)) ⇓ (P_1, e)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseUnary(P) ⇓ (P_1, Deref(e))

**(Parse-Unary-AddressOf)**

```text
IsOp(Tok(P), "&")    Γ ⊢ ParsePlace(Advance(P)) ⇓ (P_1, p)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseUnary(P) ⇓ (P_1, AddressOf(p))

**(Parse-Unary-Move)**

```text
IsKw(Tok(P), `move`)    Γ ⊢ ParsePlace(Advance(P)) ⇓ (P_1, p)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseUnary(P) ⇓ (P_1, MoveExpr(p))

**(Postfix-Propagate)**
IsOp(Tok(P), "?")
──────────────────────────────────────────────────────────────

```text
Γ ⊢ PostfixStep(P, e) ⇓ (Advance(P), Propagate(e))

**(Parse-Alloc-Implicit)**

```text
IsOp(Tok(P), "^")    Γ ⊢ ParseExpr(Advance(P)) ⇓ (P_1, e)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (P_1, AllocExpr(⊥, e))

**(Parse-Unsafe-Expr)**

```text
IsKw(Tok(P), `unsafe`)    Γ ⊢ ParseBlock(Advance(P)) ⇓ (P_1, b)
──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (P_1, UnsafeBlockExpr(b))

#### 16.8.3 AST Representation / Form

Expr = UnsafeBlockExpr(body) | MoveExpr(place) | AddressOf(place) | Deref(expr) | AllocExpr(region_opt, expr) | Propagate(expr) | …

ResolveExpr-Alloc-Explicit-ByAlias rewrites:

```text
Γ ⊢ ResolveValueName(r) ⇓ ent    RegionAlias(ent)    Γ ⊢ ResolveExpr(e) ⇓ e'
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(Binary("^", Identifier(r), e)) ⇓ AllocExpr(r, e')

#### 16.8.4 Static Semantics

```text
HasLayoutPacked(D) ⇔ `layout(packed)` appears in D.attrs_opt

```text
PackedField(p) ⇔ p = FieldAccess(base, f) ∧ StripPerm(ExprType(base)) = TypePath(path) ∧ RecordDecl(path) = R ∧ HasLayoutPacked(R)

```text
AddrOfOk(p) ⇔ IsPlace(p) ∧ (p = IndexAccess(_, idx) ⇒ Γ; R; L ⊢ idx : T_i ∧ StripPerm(T_i) = TypePrim(`usize`)) ∧ (PackedField(p) ⇒ UnsafeSpan(span(p)))

**(T-Unsafe-Expr)**

```text
Γ; R; L ⊢ b : T
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ UnsafeBlockExpr(b) : T

**(Chk-Unsafe-Expr)**

```text
Γ; R; L ⊢ b ⇐ T ⊣ ∅
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ UnsafeBlockExpr(b) ⇐ T ⊣ ∅

**(T-AddrOf)**

```text
Γ; R; L ⊢ p :place T    AddrOfOk(p)
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ AddressOf(p) : TypePtr(T, `Valid`)

**(T-Deref-Ptr)**

```text
Γ; R; L ⊢ e : TypePtr(T, `Valid`)    BitcopyType(T)
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Deref(e) : T

**(T-Deref-Raw)**

```text
UnsafeSpan(span(Deref(e)))    Γ; R; L ⊢ e : TypeRawPtr(q, T)    BitcopyType(T)
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Deref(e) : T

**(P-Deref-Ptr)**, **(P-Deref-Raw-Imm)**, and **(P-Deref-Raw-Mut)** define place typing for safe and raw dereference.

**(T-Move)**

```text
Γ; R; L ⊢ p :place T
──────────────────────────────────────────────

```text
Γ; R; L ⊢ MoveExpr(p) : T

**(T-Alloc-Explicit)**

```text
Γ; R; L ⊢ e : T    Γ; R; L ⊢ Identifier(r) : T_r    RegionActiveType(T_r)
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ AllocExpr(r, e) : T

**(T-Alloc-Implicit)**

```text
InnermostActiveRegion(Γ) = r    Γ; R; L ⊢ e : T
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ AllocExpr(⊥, e) : T

```text
SuccessMember(R, U) = T_s ⇔ U = TypeUnion([T_1, …, T_n]) ∧ ¬(Γ ⊢ T_s <: R) ∧ ∀ i ≠ s. Γ ⊢ T_i <: R

**(T-Propagate-Outcome)**

```text
AsyncSig(R) = ⊥    Γ; R; L ⊢ e : U    OutcomeSig(U) = ⟨T_s, E_s⟩    OutcomeSig(R) = ⟨T_r, E_r⟩    Γ ⊢ E_s <: E_r
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Propagate(e) : T_s

**(T-Propagate)**

```text
AsyncSig(R) = ⊥    Γ; R; L ⊢ e : U    SuccessMember(R, U) = T_s
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Propagate(e) : T_s

```text
SuccessMemberAsync(E, U) = T_s ⇔ U = TypeUnion([T_1, …, T_n]) ∧ ¬(Γ ⊢ T_s <: E) ∧ ∀ i ≠ s. Γ ⊢ T_i <: E

**(T-Async-Try-Outcome)**

```text
AsyncSig(R) = ⟨Out, In, Result, E⟩    E ≠ TypePrim("!")    Γ; R; L ⊢ e : U    OutcomeSig(U) = ⟨T_s, E_s⟩    Γ ⊢ E_s <: E
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Propagate(e) : T_s

**(T-Async-Try)**

```text
AsyncSig(R) = ⟨Out, In, Result, E⟩    E ≠ TypePrim("!")    Γ; R; L ⊢ e : U    SuccessMemberAsync(E, U) = T_s
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Propagate(e) : T_s

**(Async-Try-Infallible-Err)**

```text
AsyncSig(R) = ⟨Out, In, Result, E⟩    E = TypePrim("!")    Γ; R; L ⊢ e : U    c = Code(E-CON-0230)
──────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Propagate(e) ⇑ c

#### 16.8.5 Dynamic Semantics

**(EvalSigma-UnsafeBlock)**

```text
Γ ⊢ EvalBlockSigma(b, σ) ⇓ (out, σ')
────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(UnsafeBlockExpr(b), σ) ⇓ (out, σ')

**(EvalSigma-AddressOf)**

```text
Γ ⊢ AddrOfSigma(p, σ) ⇓ (Val(addr), σ_1)
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(AddressOf(p), σ) ⇓ (Val(Ptr@Valid(addr)), σ_1)

**(EvalSigma-Deref)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v_ptr), σ_1)    Γ ⊢ ReadPtrSigma(v_ptr, σ_1) ⇓ (out, σ_2)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Deref(e), σ) ⇓ (out, σ_2)

**(EvalSigma-Move)**

```text
Γ ⊢ MovePlaceSigma(p, σ) ⇓ (out, σ_1)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(MoveExpr(p), σ) ⇓ (out, σ_1)

**(EvalSigma-Alloc-Implicit)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    ActiveTarget(σ_1) = r    RegionAlloc(σ_1, r, v) ⇓ (σ_2, v')
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(AllocExpr(⊥, e), σ) ⇓ (Val(v'), σ_2)

**(EvalSigma-Alloc-Implicit-Ctrl)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Ctrl(κ), σ_1)
──────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(AllocExpr(⊥, e), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-Alloc-Explicit)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    LookupVal(σ_1, r) = v_r    RegionHandleOf(v_r) = h    ResolveTarget(σ_1, h) = r_t    RegionAlloc(σ_1, r_t, v) ⇓ (σ_2, v')
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(AllocExpr(r, e), σ) ⇓ (Val(v'), σ_2)

**(EvalSigma-Alloc-Explicit-Ctrl)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Ctrl(κ), σ_1)
────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(AllocExpr(r, e), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-Propagate-Success-Outcome)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    U = ExprType(e)    AsyncSig(RetType(Γ)) = ⊥    OutcomeSig(U) = ⟨T_s, E_s⟩    OutcomeSig(RetType(Γ)) = ⟨T_r, E_r⟩    ModalCase(v) = ⟨`@Value`, v_s⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Propagate(e), σ) ⇓ (Val(FieldValue(v_s, `value`)), σ_1)

**(EvalSigma-Propagate-Success-Async-Outcome)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    U = ExprType(e)    AsyncSig(RetType(Γ)) = ⟨Out, In, Result, E⟩    OutcomeSig(U) = ⟨T_s, E_s⟩    ModalCase(v) = ⟨`@Value`, v_s⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Propagate(e), σ) ⇓ (Val(FieldValue(v_s, `value`)), σ_1)

**(EvalSigma-Propagate-Error-Outcome)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    U = ExprType(e)    AsyncSig(RetType(Γ)) = ⊥    OutcomeSig(U) = ⟨T_s, E_s⟩    OutcomeSig(RetType(Γ)) = ⟨T_r, E_r⟩    ModalCase(v) = ⟨`@Error`, v_e⟩
out = `Outcome`<T_r, E_r>`@Error`{`error`: FieldValue(v_e, `error`)}
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Propagate(e), σ) ⇓ (Ctrl(Return(out)), σ_1)

**(EvalSigma-Propagate-Error-Async-Outcome)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    U = ExprType(e)    AsyncSig(RetType(Γ)) = ⟨Out, In, Result, E⟩    E ≠ TypePrim("!")    OutcomeSig(U) = ⟨T_s, E_s⟩    ModalCase(v) = ⟨`@Error`, v_e⟩

```text
async_failed = RecordValue(ModalStateRef([`Async`], `@Failed`), [⟨`error`, FieldValue(v_e, `error`)⟩])
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Propagate(e), σ) ⇓ (Ctrl(Fail(async_failed)), σ_1)

**(EvalSigma-Propagate-Success-Union)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    U = ExprType(e)    AsyncSig(RetType(Γ)) = ⊥    SuccessMember(RetType(Γ), U) = T_s    UnionCase(v) = ⟨T_s, v_s⟩
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Propagate(e), σ) ⇓ (Val(v_s), σ_1)

**(EvalSigma-Propagate-Success-Async-Union)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    U = ExprType(e)    AsyncSig(RetType(Γ)) = ⟨Out, In, Result, E⟩    SuccessMemberAsync(E, U) = T_s    UnionCase(v) = ⟨T_s, v_s⟩
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Propagate(e), σ) ⇓ (Val(v_s), σ_1)

**(EvalSigma-Propagate-Error-Union)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    U = ExprType(e)    AsyncSig(RetType(Γ)) = ⊥    SuccessMember(RetType(Γ), U) = T_s    UnionCase(v) = ⟨T_e, v_e⟩    T_e ≠ T_s
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Propagate(e), σ) ⇓ (Ctrl(Return(v_e)), σ_1)

**(EvalSigma-Propagate-Error-Async-Union)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    U = ExprType(e)    AsyncSig(RetType(Γ)) = ⟨Out, In, Result, E⟩    E ≠ TypePrim("!")    SuccessMemberAsync(E, U) = T_s    UnionCase(v) = ⟨T_e, v_e⟩    T_e ≠ T_s

```text
async_failed = RecordValue(ModalStateRef([`Async`], `@Failed`), [⟨`error`, v_e⟩])
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Propagate(e), σ) ⇓ (Ctrl(Fail(async_failed)), σ_1)

**(EvalSigma-Propagate-Ctrl)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Ctrl(κ), σ_1)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Propagate(e), σ) ⇓ (Ctrl(κ), σ_1)

```text
ExprState = {⟨e, σ⟩, ⟨Val(v), σ⟩, ⟨Ctrl(κ), σ⟩}

```text
TerminalExpr(⟨Val(v), σ⟩)

```text
TerminalExpr(⟨Ctrl(κ), σ⟩)

**(StepSigma-Pure)**

```text
⟨e⟩ → ⟨e'⟩
────────────────────────────────

```text
⟨e, σ⟩ → ⟨e', σ⟩

**(StepSigma-Alloc-Implicit)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    ActiveTarget(σ_1) = r    RegionAlloc(σ_1, r, v) ⇓ (σ_2, v')
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨AllocExpr(⊥, e), σ⟩ → ⟨Val(v'), σ_2⟩

**(StepSigma-Alloc-Implicit-Ctrl)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Ctrl(κ), σ_1)
────────────────────────────────────────────────────────────

```text
⟨AllocExpr(⊥, e), σ⟩ → ⟨Ctrl(κ), σ_1⟩

**(StepSigma-Alloc-Explicit)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    LookupVal(σ_1, r) = v_r    RegionHandleOf(v_r) = h    ResolveTarget(σ_1, h) = r_t    RegionAlloc(σ_1, r_t, v) ⇓ (σ_2, v')
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨AllocExpr(r, e), σ⟩ → ⟨Val(v'), σ_2⟩

**(StepSigma-Alloc-Explicit-Ctrl)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Ctrl(κ), σ_1)
──────────────────────────────────────────────

```text
⟨AllocExpr(r, e), σ⟩ → ⟨Ctrl(κ), σ_1⟩

**(StepSigma-Block)**

```text
Γ ⊢ EvalBlockSigma(BlockExpr(stmts, tail_opt), σ) ⇓ (out, σ')
────────────────────────────────────────────────────────────────────────────

```text
⟨BlockExpr(stmts, tail_opt), σ⟩ → ⟨out, σ'⟩

**(StepSigma-UnsafeBlock)**

```text
Γ ⊢ EvalBlockSigma(b, σ) ⇓ (out, σ')
────────────────────────────────────────────────────────

```text
⟨UnsafeBlockExpr(b), σ⟩ → ⟨out, σ'⟩

**(StepSigma-Loop)**

```text
Γ ⊢ EvalSigma(ℓ, σ) ⇓ (out, σ')    ℓ ∈ {LoopInfinite(_, _), LoopConditional(_, _, _), LoopIter(_, _, _, _, _)}
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨ℓ, σ⟩ → ⟨out, σ'⟩

**(StepSigma-Stateful-Other)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (out, σ')    e ∉ {AllocExpr(_, _), BlockExpr(_, _), UnsafeBlockExpr(_), LoopInfinite(_, _), LoopConditional(_, _, _), LoopIter(_, _, _, _, _)}
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨e, σ⟩ → ⟨out, σ'⟩

#### 16.8.6 Lowering

**(Lower-Expr-UnsafeBlock)**

```text
Γ ⊢ LowerBlock(b) ⇓ ⟨IR, v⟩
─────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(UnsafeBlockExpr(b)) ⇓ ⟨IR, v⟩

**(Lower-Expr-Move)**

```text
Γ ⊢ LowerMovePlace(p) ⇓ ⟨IR, v⟩
──────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(MoveExpr(p)) ⇓ ⟨IR, v⟩

**(Lower-Expr-AddressOf)**

```text
Γ ⊢ LowerAddrOf(p) ⇓ ⟨IR, addr⟩
────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(AddressOf(p)) ⇓ ⟨IR, Ptr@Valid(addr)⟩

**(Lower-Expr-Deref)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v_ptr⟩    Γ ⊢ LowerRawDeref(v_ptr) ⇓ ⟨IR_d, v⟩
──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Deref(e)) ⇓ ⟨SeqIR(IR_e, IR_d), v⟩

**(Lower-Expr-Alloc)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(AllocExpr(r_opt, e)) ⇓ ⟨SeqIR(IR_e, AllocIR(r_opt, v)), v_alloc⟩

**(Lower-Expr-Propagate-Success-Outcome)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩    U = ExprType(e)    OutcomeSig(U) = ⟨T_s, E_s⟩    OutcomeState(v) = `@Value`    OutcomeField(v, `value`) = v_s
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Propagate(e)) ⇓ ⟨IR_e, v_s⟩

**(Lower-Expr-Propagate-Return-Outcome)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩    U = ExprType(e)    OutcomeSig(U) = ⟨T_s, E_s⟩    OutcomeState(v) = `@Error`    OutcomeField(v, `error`) = v_e
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Propagate(e)) ⇓ ⟨SeqIR(IR_e, ReturnIR(`Outcome@Error`{`error`: v_e})), v_unreach⟩

**(Lower-Expr-Propagate-Success-Union)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩    U = ExprType(e)    SuccessMember(RetType(Γ), U) = T_s    UnionCase(v) = ⟨T_s, v_s⟩
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Propagate(e)) ⇓ ⟨IR_e, v_s⟩

**(Lower-Expr-Propagate-Return-Union)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩    U = ExprType(e)    SuccessMember(RetType(Γ), U) = T_s    UnionCase(v) = ⟨T_e, v_e⟩    T_e ≠ T_s
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Propagate(e)) ⇓ ⟨SeqIR(IR_e, ReturnIR(v_e)), v_unreach⟩

`LowerRawDeref`, `LowerAddrOf`, and `LowerMovePlace` define the pointer, address, and move-state mechanics used by these expressions.

#### 16.8.7 Diagnostics

Diagnostics are defined for address-of on non-places, address-of of packed fields outside `unsafe`, non-`usize` indexing in address-of contexts, dereference of null or expired safe pointers, raw-pointer dereference outside `unsafe`, explicit allocation through a non-region binding, implicit allocation without an active region, and propagation inside async procedures whose error type is `!`.

### 16.9 Closure and Pipeline Expressions

#### 16.9.1 Syntax

```text
```

pipeline_expr      ::= base_postfix_expr ("=>" base_postfix_expr)*
closure_expr       ::= "|" closure_param_list? "|" ("->" type)? closure_body
closure_param_list ::= closure_param ("," closure_param)* ","?
closure_param      ::= "move"? identifier (":" type)?
closure_body       ::= expression | block_expr
```

Trailing commas in `closure_param_list` are permitted only when `TrailingCommaAllowed` (§5.5). A trailing comma does not denote an additional parameter.

Within `closure_expr`, if a typed parameter annotation has a top-level `union_type`, it MUST be parenthesized as `("(" type ")")`. This grouped form is permitted only to disambiguate closure parameter annotations and does not introduce a distinct type constructor.

Closure invocation uses ordinary call syntax; the closure-specific rules for that call form are owned by this section.

#### 16.9.2 Parsing

**(Parse-Pipeline)**

```text
Γ ⊢ ParseBasePostfix(P) ⇓ (P_1, e_0)    Γ ⊢ ParsePipelineTail(P_1, e_0) ⇓ (P_2, e)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePipeline(P) ⇓ (P_2, e)

**(Parse-PipelineTail-Stop)**
¬ IsOp(Tok(P), "=>")
───────────────────────────────────────

```text
Γ ⊢ ParsePipelineTail(P, e) ⇓ (P, e)

**(Parse-PipelineTail-Cons)**

```text
IsOp(Tok(P), "=>")    Γ ⊢ ParseBasePostfix(Advance(P)) ⇓ (P_1, e_1)    Γ ⊢ ParsePipelineTail(P_1, PipelineExpr(e, e_1)) ⇓ (P_2, e_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePipelineTail(P, e) ⇓ (P_2, e_2)

**(Parse-Closure-Expr)**

```text
IsOp(Tok(P), "|")    Γ ⊢ ParseClosureParams(Advance(P)) ⇓ (P_1, params)    IsOp(Tok(P_1), "|")    Γ ⊢ ParseClosureRetOpt(Advance(P_1)) ⇓ (P_2, ret_opt)    Γ ⊢ ParseClosureBody(P_2) ⇓ (P_3, body)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (P_3, ClosureExpr(params, ret_opt, body))

**(Parse-Closure-Expr-Empty)**

```text
IsOp(Tok(P), "|")    IsOp(Tok(Advance(P)), "|")    Γ ⊢ ParseClosureRetOpt(Advance(Advance(P))) ⇓ (P_1, ret_opt)    Γ ⊢ ParseClosureBody(P_1) ⇓ (P_2, body)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (P_2, ClosureExpr([], ret_opt, body))

**(Parse-ClosureParams-Single)**

```text
Γ ⊢ ParseClosureParam(P) ⇓ (P_1, p)    ¬ IsPunc(Tok(P_1), ",")
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParams(P) ⇓ (P_1, [p])

**(Parse-ClosureParams-Cons)**

```text
Γ ⊢ ParseClosureParam(P) ⇓ (P_1, p)    IsPunc(Tok(P_1), ",")    Γ ⊢ ParseClosureParams(Advance(P_1)) ⇓ (P_2, ps)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParams(P) ⇓ (P_2, [p] ++ ps)

**(Parse-ClosureParamType-Grouped)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseType(Advance(P)) ⇓ (P_1, ty)    IsPunc(Tok(P_1), ")")
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParamType(P) ⇓ (Advance(P_1), ty)

**(Parse-ClosureParamType-Plain)**

```text
¬ IsPunc(Tok(P), "(")    Γ ⊢ ParseTypeNoUnion(P) ⇓ (P_1, ty)
─────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParamType(P) ⇓ (P_1, ty)

**(Parse-ClosureParam-MoveTyped)**

```text
IsKw(Tok(P), `move`)    IsIdent(Tok(Advance(P)))    name = Lexeme(Tok(Advance(P)))    IsPunc(Tok(Advance(Advance(P))), ":")    Γ ⊢ ParseClosureParamType(Advance(Advance(Advance(P)))) ⇓ (P_1, ty)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParam(P) ⇓ (P_1, ⟨true, name, ty⟩)

**(Parse-ClosureParam-MoveUntyped)**
IsKw(Tok(P), `move`)    IsIdent(Tok(Advance(P)))    name = Lexeme(Tok(Advance(P)))    ¬ IsPunc(Tok(Advance(Advance(P))), ":")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParam(P) ⇓ (Advance(Advance(P)), ⟨true, name, ⊥⟩)

**(Parse-ClosureParam-Typed)**

```text
¬ IsKw(Tok(P), `move`)    IsIdent(Tok(P))    name = Lexeme(Tok(P))    IsPunc(Tok(Advance(P)), ":")    Γ ⊢ ParseClosureParamType(Advance(Advance(P))) ⇓ (P_1, ty)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParam(P) ⇓ (P_1, ⟨false, name, ty⟩)

**(Parse-ClosureParam-Untyped)**
¬ IsKw(Tok(P), `move`)    IsIdent(Tok(P))    name = Lexeme(Tok(P))    ¬ IsPunc(Tok(Advance(P)), ":")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParam(P) ⇓ (Advance(P), ⟨false, name, ⊥⟩)

**(Parse-ClosureRetOpt-Some)**

```text
IsOp(Tok(P), "->")    Γ ⊢ ParseType(Advance(P)) ⇓ (P_1, ty)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureRetOpt(P) ⇓ (P_1, ty)

**(Parse-ClosureRetOpt-None)**
¬ IsOp(Tok(P), "->")
────────────────────────────────────────

```text
Γ ⊢ ParseClosureRetOpt(P) ⇓ (P, ⊥)

**(Parse-ClosureBody-Block)**

```text
IsPunc(Tok(P), "{")    Γ ⊢ ParseBlock(P) ⇓ (P_1, b)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureBody(P) ⇓ (P_1, BlockExpr(b))

**(Parse-ClosureBody-Expr)**

```text
¬ IsPunc(Tok(P), "{")    Γ ⊢ ParseExpr(P) ⇓ (P_1, e)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureBody(P) ⇓ (P_1, e)

#### 16.9.3 AST Representation / Form

Expr = PipelineExpr(left, right) | ClosureExpr(params, ret_type_opt, body) | …

```text
ClosureParam = ⟨move_opt, name, type_opt⟩    move_opt ∈ {true, false}    type_opt ∈ {⊥} ∪ Type
ClosureParams = [ClosureParam]
ClosureBody = Expr

#### 16.9.4 Static Semantics

```text
FreeVars(e) = { x | x ∈ Identifier ∧ Bound(x, e) ∧ ¬ LocallyBound(x, e) }

```text
CaptureSet(C) = FreeVars(C.body) ∖ { p.name | p ∈ C.params }

```text
MoveCaptureSet(C) = { x | x ∈ CaptureSet(C) ∧ (∃ p ∈ C.params. p = ⟨true, x, _⟩) }

```text
                  ∪ { x | x ∈ CaptureSet(C) ∧ MoveExpr(e) ∈ C.body ∧ PlaceRoot(e) = x }
RefCaptureSet(C) = CaptureSet(C) \ MoveCaptureSet(C)

```text
SharedCaptures(C) = { x | x ∈ CaptureSet(C) ∧ Γ(x) = TypePerm(`shared`, _) }

```text
ConstCaptures(C) = { x | x ∈ CaptureSet(C) ∧ Γ(x) = TypePerm(`const`, _) }

```text
UniqueCaptures(C) = { x | x ∈ CaptureSet(C) ∧ Γ(x) = TypePerm(`unique`, _) }

```text
IsEscaping(C) ⇔ ExpectedType(C) ≠ ⊥ ∧ CanEscape(ExpectedType(C))

```text
CanEscape(T) ⇔ T = TypeClosure(_, _, _) ∨ (IsGenericType(T) ∧ ¬ LocalBound(T))

```text
IsLocalClosure(C) ⇔ ¬ IsEscaping(C)

Params(C) = C.params
Annot(p) = p.type_opt

**(T-Closure-NonCapturing)**
C = ClosureExpr(params, ret_opt, body)    CaptureSet(C) = ∅

```text
∀ i. ParamType(params[i]) = T_i    (ret_opt ≠ ⊥ ⇒ R = ret_opt)    (ret_opt = ⊥ ⇒ Γ' ⊢ body : R)

```text
Γ' = Γ ∪ { params[i].name ↦ T_i | i ∈ 1..|params| }    Γ' ⊢ body : R
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ C : TypeFunc([⟨params[i].move_opt, T_i⟩ | i ∈ 1..|params|], R)

**(T-Closure-Capturing)**

```text
C = ClosureExpr(params, ret_opt, body)    CaptureSet(C) ≠ ∅    IsLocalClosure(C)

```text
∀ i. ParamType(params[i]) = T_i    (ret_opt ≠ ⊥ ⇒ R = ret_opt)    (ret_opt = ⊥ ⇒ Γ' ⊢ body : R)
UniqueCaptures(C) = ∅

```text
Γ' = Γ ∪ { params[i].name ↦ T_i | i ∈ 1..|params| }    Γ' ⊢ body : R
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ C : TypeClosure([⟨params[i].move_opt, T_i⟩ | i ∈ 1..|params|], R, ⊥)

**(T-Closure-Escaping)**

```text
C = ClosureExpr(params, ret_opt, body)    CaptureSet(C) ≠ ∅    IsEscaping(C)

```text
∀ i. ParamType(params[i]) = T_i    (ret_opt ≠ ⊥ ⇒ R = ret_opt)    (ret_opt = ⊥ ⇒ Γ' ⊢ body : R)
UniqueCaptures(C) = ∅

```text
SharedCaptures(C) = {x_1, …, x_k}    deps = [(x_j, Γ(x_j)) | j ∈ 1..k]

```text
Γ' = Γ ∪ { params[i].name ↦ T_i | i ∈ 1..|params| }    Γ' ⊢ body : R
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ C : TypeClosure([⟨params[i].move_opt, T_i⟩ | i ∈ 1..|params|], R, ⟨deps⟩)

**(K-Closure-Escape-Type)**
C is escaping    SharedCaptures(C) = {x_1, …, x_n}
─────────────────────────────────────────────────────────────────────────────────────────────────────────────
Type(C) = |vec_T| → R [`shared`: {x_1 : `shared` T_1, …, x_n : `shared` T_n}]

**(Capture-Const)**

```text
x ∈ ConstCaptures(C)
────────────────────────────────────────────────────────────────
CaptureMode(C, x) = ByRef

**(Capture-Shared)**

```text
x ∈ SharedCaptures(C)
────────────────────────────────────────────────────────────────
CaptureMode(C, x) = ByRef

**(Capture-Unique-Err)**

```text
x ∈ UniqueCaptures(C)    c = Code(E-CON-0120)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ C ⇑ c

**(T-ClosureCall)**

```text
Γ; R; L ⊢ callee : TypeClosure(params, R_c, _)    Γ; R; L ⊢ ArgsOk_T(params, args)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) : R_c

**(Infer-Closure-Params)**

```text
Γ; R; L ⊢ C ⇐ TypeFunc([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R_t) ⊣ ∅    Params(C) = [p_1, …, p_n]    ∀ i. (Annot(p_i) = ⊥ ⇒ ParamType(p_i) = T_i) ∧ (Annot(p_i) = T_i' ⇒ Γ ⊢ T_i' ≡ T_i)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ InferClosureParams(C) ⇓ ok

**(Infer-Closure-Params-Err)**

```text
∃ i. Annot(Params(C)_i) = ⊥    ExpectedType(C) = ⊥    c = Code(E-SEM-2591)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ InferClosureParams(C) ⇑ c

**(Infer-Closure-Return)**

```text
C = ClosureExpr(params, ⊥, body)    Γ' = Γ ∪ { params[i].name ↦ ParamType(params[i]) | i ∈ 1..|params| }    Γ' ⊢ body : R
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ InferClosureReturn(C) ⇓ R

The shared dependency set MAY be inferred when the closure is checked against an expected closure type. Otherwise it MUST be written explicitly.

ClosureMoveCaptures(C) = MoveCaptureSet(C)
ClosureRefCaptures(C) = RefCaptureSet(C)

```text
MoveCaptureValid(𝔅, x) ⇔ Lookup_B(𝔅, x) = ⟨Valid, mov, _, _⟩ ∧ mov = mov

```text
MoveCaptureErr(𝔅, x) ⇔ Lookup_B(𝔅, x) = ⟨s, mv, _, _⟩ ∧ (s ≠ Valid ∨ mv = immov)

```text
RefCaptureValid(𝔅, x) ⇔ Lookup_B(𝔅, x) = ⟨s, _, _, _⟩ ∧ s = Valid

```text
ApplyMoveCapture(𝔅, x) = Update_B(𝔅, x, ⟨Moved, mv, m, r⟩) where Lookup_B(𝔅, x) = ⟨_, mv, m, r⟩

ApplyMoveCaptures(𝔅, []) = 𝔅
ApplyMoveCaptures(𝔅, [x] ++ xs) = ApplyMoveCaptures(ApplyMoveCapture(𝔅, x), xs)

**(B-Closure-NonCapturing)**
C = ClosureExpr(params, ret_type_opt, body)    CaptureSet(C) = ∅
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; 𝔅; Π ⊢ C ⇒ 𝔅 ▷ Π

**(B-Closure-Capturing)**

```text
C = ClosureExpr(params, ret_type_opt, body)    CaptureSet(C) ≠ ∅
MoveCaps = ClosureMoveCaptures(C)    RefCaps = ClosureRefCaptures(C)

```text
∀ x ∈ MoveCaps. MoveCaptureValid(𝔅, x)    ∀ x ∈ RefCaps. RefCaptureValid(𝔅, x)
𝔅' = ApplyMoveCaptures(𝔅, MoveCaps)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; 𝔅; Π ⊢ C ⇒ 𝔅' ▷ Π

**(B-Closure-MoveCapture-Moved-Err)**
C = ClosureExpr(params, ret_type_opt, body)    MoveCaps = ClosureMoveCaptures(C)

```text
∃ x ∈ MoveCaps. Lookup_B(𝔅, x) = ⟨s, mov, _, _⟩ ∧ s ≠ Valid ∧ mov = mov    c = Code(E-CON-0121)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; 𝔅; Π ⊢ C ⇑ c

**(B-Closure-MoveCapture-Immovable-Err)**
C = ClosureExpr(params, ret_type_opt, body)    MoveCaps = ClosureMoveCaptures(C)

```text
∃ x ∈ MoveCaps. Lookup_B(𝔅, x) = ⟨_, mv, _, _⟩ ∧ mv = immov    c = Code(E-MEM-3006)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; 𝔅; Π ⊢ C ⇑ c

**(B-Closure-RefCapture-Moved-Err)**
C = ClosureExpr(params, ret_type_opt, body)    RefCaps = ClosureRefCaptures(C)

```text
∃ x ∈ RefCaps. Lookup_B(𝔅, x) = ⟨s, _, _, _⟩ ∧ s ≠ Valid    c = Code(E-MEM-3001)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; 𝔅; Π ⊢ C ⇑ c

**(T-Pipeline)**

```text
Γ; R; L ⊢ e_1 : T_1    Γ; R; L ⊢ e_2 : T_f
(T_f = TypeFunc([(m, T_p)], R_f) ∨ T_f = TypeClosure([(m, T_p)], R_f, _))

```text
Γ ⊢ T_1 <: T_p
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ PipelineExpr(e_1, e_2) : R_f

**(T-Pipeline-NotCallable-Err)**

```text
Γ; R; L ⊢ e_1 : T_1    Γ; R; L ⊢ e_2 : T_f

```text
T_f ≠ TypeFunc(_, _)    T_f ≠ TypeClosure(_, _, _)    c = Code(E-SEM-2538)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ PipelineExpr(e_1, e_2) ⇑ c

**(T-Pipeline-TypeMismatch-Err)**

```text
Γ; R; L ⊢ e_1 : T_1    Γ; R; L ⊢ e_2 : T_f
(T_f = TypeFunc([(m, T_p)], _) ∨ T_f = TypeClosure([(m, T_p)], _, _))

```text
¬(Γ ⊢ T_1 <: T_p)    c = Code(E-SEM-2539)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ PipelineExpr(e_1, e_2) ⇑ c

**(T-Pipeline-ArgCount-Err)**

```text
Γ; R; L ⊢ e_1 : T_1    Γ; R; L ⊢ e_2 : T_f

```text
(T_f = TypeFunc(params, _) ∨ T_f = TypeClosure(params, _, _))    |params| ≠ 1    c = Code(E-SEM-2539)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ PipelineExpr(e_1, e_2) ⇑ c

**(B-Pipeline)**

```text
Γ; 𝔅; Π ⊢ e_1 ⇒ 𝔅_1 ▷ Π_1    Γ; 𝔅_1; Π_1 ⊢ e_2 ⇒ 𝔅_2 ▷ Π_2
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; 𝔅; Π ⊢ PipelineExpr(e_1, e_2) ⇒ 𝔅_2 ▷ Π_2

If a closure parameter lacks an annotation and no expected function type is available, inference fails.

The shared dependency set MAY be inferred when the closure is checked against an expected closure type. Otherwise it MUST be written explicitly.

#### 16.9.5 Dynamic Semantics

```text
BuildClosureEnv(σ, C) = env ⇔ env = { x ↦ CaptureVal(σ, C, x) | x ∈ CaptureSet(C) }

```text
CaptureVal(σ, C, x) = Ptr@Valid(AddrOfBind(x))    if x ∈ RefCaptureSet(C)

```text
CaptureVal(σ, C, x) = MoveVal(σ, x)      if x ∈ MoveCaptureSet(C)

```text
AllocEnv(σ, env) = (σ', env_ptr) ⇔ env_ptr = Alloc(EnvSize(env)) ∧ σ' = StoreEnv(σ, env_ptr, env)

```text
BindEnv(σ, env_ptr) = σ' ⇔
  C = ClosureOf(env_ptr) ∧

```text
  env = LoadEnv(σ, env_ptr) ∧

```text
  BindCapturedList(σ, C, [⟨x, env[x]⟩ | x ∈ CaptureList(C)]) ⇓ (σ', bs)

```text
LoadEnv(σ, env_ptr) = env ⇔

```text
  ∀ (x, offset) ∈ EnvOffsets(env_ptr). env[x] = ReadAddr(σ, GEP(env_ptr, offset))

```text
EnvOffsets(env_ptr) = [(x_i, offset_i) | C = ClosureOf(env_ptr) ∧ Γ ⊢ ClosureEnvLayout(C) ⇓ ⟨_, _, offsets⟩ ∧ CaptureSet(C) = [x_1, …, x_n] ∧ offsets = [offset_1, …, offset_n]]

```text
BindCapturedList(σ, C, []) ⇓ (σ, [])

```text
BindCapturedList(σ, C, [⟨x, v⟩] ++ xs) ⇓ (σ_2, b :: bs) ⇔ BindCaptured(σ, C, x, v) ⇓ (σ_1, b) ∧ BindCapturedList(σ_1, C, xs) ⇓ (σ_2, bs)

```text
BindCaptured(σ, C, x, Ptr@Valid(addr)) ⇓ (σ', b) ⇔ x ∈ RefCaptureSet(C) ∧ BindVal(σ, x, Alias(addr)) ⇓ (σ', b)

```text
BindCaptured(σ, C, x, v) ⇓ (σ', b) ⇔ x ∈ MoveCaptureSet(C) ∧ BindVal(σ, x, v) ⇓ (σ', b)

```text
EnvSize(env) = size    ⇔ ClosureEnvLayout(ClosureOf(env)) ⇓ ⟨size, _, _⟩

**(EvalSigma-Closure-NonCapturing)**

```text
C = ClosureExpr(params, ret_type_opt, body)    CaptureSet(C) = ∅    Γ ⊢ Mangle(C) ⇓ sym
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(C, σ) ⇓ (Val(ClosureVal(null, sym)), σ)

**(EvalSigma-Closure-Capturing)**

```text
C = ClosureExpr(params, ret_type_opt, body)    CaptureSet(C) ≠ ∅    Γ ⊢ Mangle(C) ⇓ sym

```text
BuildClosureEnv(σ, C) = env    AllocEnv(σ, env) = (σ_1, env_ptr)

```text
MarkMoved(σ_1, MoveCaptureSet(C)) = σ_2
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(C, σ) ⇓ (Val(ClosureVal(env_ptr, sym)), σ_2)

```text
MarkMoved(σ, []) = σ

```text
MarkMoved(σ, [x] ++ xs) = MarkMoved(SetMoved(σ, x), xs)

**(EvalSigma-ClosureCall)**

```text
Γ ⊢ EvalSigma(e_c, σ) ⇓ (Val(ClosureVal(env_ptr, code_ptr)), σ_1)

```text
Γ ⊢ EvalArgsSigma(ClosureParams(ExprType(e_c)), args, σ_1) ⇓ (Val(vec_v), σ_2)

```text
Γ ⊢ ApplyClosureSigma(env_ptr, code_ptr, vec_v, σ_2) ⇓ (out, σ_3)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(ClosureCall(e_c, args), σ) ⇓ (out, σ_3)

ClosureParams(TypeClosure(params, R, deps_opt)) = params
ClosureParams(TypeFunc(params, R)) = params

```text
ApplyClosureSigma(env_ptr, code_ptr, vec_v, σ) = (out, σ') ⇔
  body = CodeBody(code_ptr) ∧
  params = CodeParams(code_ptr) ∧

```text
  σ_1 = BindParams(σ, params, vec_v) ∧

```text
  (env_ptr ≠ null ⇒ σ_2 = BindEnv(σ_1, env_ptr)) ∧

```text
  (env_ptr = null ⇒ σ_2 = σ_1) ∧

```text
  Γ ⊢ EvalSigma(body, σ_2) ⇓ (out, σ')

**(EvalSigma-ClosureCall-Ctrl)**

```text
Γ ⊢ EvalSigma(e_c, σ) ⇓ (Ctrl(κ), σ_1)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(ClosureCall(e_c, args), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-ClosureCall-Ctrl-Args)**

```text
Γ ⊢ EvalSigma(e_c, σ) ⇓ (Val(ClosureVal(env_ptr, code_ptr)), σ_1)

```text
Γ ⊢ EvalArgsSigma(ClosureParams(ExprType(e_c)), args, σ_1) ⇓ (Ctrl(κ), σ_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(ClosureCall(e_c, args), σ) ⇓ (Ctrl(κ), σ_2)

`ClosureCall(e_c, args)` is the resolved internal call form for an ordinary source call `Call(callee, args)` whose callee has closure type. §16.3.5 bridges the source call form to this internal dynamic-semantic form.

Pipeline expressions desugar to function or closure application: `e_1 => e_2 ≡ e_2(e_1)`.

**(EvalSigma-Pipeline-Func)**

```text
Γ ⊢ EvalSigma(e_1, σ) ⇓ (Val(v_1), σ_1)    Γ ⊢ EvalSigma(e_2, σ_1) ⇓ (Val(FuncVal(sym)), σ_2)

```text
Γ ⊢ ApplyProcSigma(sym, [v_1], σ_2) ⇓ (out, σ_3)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(PipelineExpr(e_1, e_2), σ) ⇓ (out, σ_3)

**(EvalSigma-Pipeline-Closure)**

```text
Γ ⊢ EvalSigma(e_1, σ) ⇓ (Val(v_1), σ_1)    Γ ⊢ EvalSigma(e_2, σ_1) ⇓ (Val(ClosureVal(env_ptr, code_ptr)), σ_2)

```text
Γ ⊢ ApplyClosureSigma(env_ptr, code_ptr, [v_1], σ_2) ⇓ (out, σ_3)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(PipelineExpr(e_1, e_2), σ) ⇓ (out, σ_3)

**(EvalSigma-Pipeline-Ctrl-Left)**

```text
Γ ⊢ EvalSigma(e_1, σ) ⇓ (Ctrl(κ), σ_1)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(PipelineExpr(e_1, e_2), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-Pipeline-Ctrl-Right)**

```text
Γ ⊢ EvalSigma(e_1, σ) ⇓ (Val(v_1), σ_1)    Γ ⊢ EvalSigma(e_2, σ_1) ⇓ (Ctrl(κ), σ_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(PipelineExpr(e_1, e_2), σ) ⇓ (Ctrl(κ), σ_2)

#### 16.9.6 Lowering

```text
ClosureEnvFields(C) = [(x_i, T_i) | x_i ∈ CaptureSet(C) ∧ CaptureType(C, x_i) = T_i]

```text
CaptureType(C, x) = Ptr<T_x>@Valid ⇔ x ∈ ConstCaptures(C) ∪ SharedCaptures(C) ∧ Γ(x) = T_x

```text
CaptureType(C, x) = T_x ⇔ x ∈ MoveCaptureSet(C) ∧ Γ(x) = T_x

**(Layout-ClosureEnv)**

```text
C = ClosureExpr(params, ret_type_opt, body)    ClosureEnvFields(C) = fields    RecordLayout(fields) ⇓ ⟨size, align, offsets⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ClosureEnvLayout(C) ⇓ ⟨size, align, offsets⟩

**(Layout-ClosureEnv-Empty)**
C = ClosureExpr(params, ret_type_opt, body)    CaptureSet(C) = ∅
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ClosureEnvLayout(C) ⇓ ⟨0, 1, []⟩

**(Lower-Expr-Closure-NonCapturing)**

```text
C = ClosureExpr(params, ret_type_opt, body)    CaptureSet(C) = ∅    Γ ⊢ ClosureCodeSym(C) ⇓ sym
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(C) ⇓ ⟨EmptyIR, ClosureVal(null, sym)⟩

**(Lower-Expr-Closure-Capturing)**

```text
C = ClosureExpr(params, ret_type_opt, body)    CaptureSet(C) ≠ ∅

```text
Γ ⊢ ClosureCodeSym(C) ⇓ sym    Γ ⊢ ClosureEnvLayout(C) ⇓ ⟨size, align, offsets⟩

```text
Γ ⊢ LowerCaptureEnv(C, offsets) ⇓ ⟨IR_env, env_ptr⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(C) ⇓ ⟨IR_env, ClosureVal(env_ptr, sym)⟩

```text
LowerCaptureEnv(C, offsets) ⇓ ⟨IR, env_ptr⟩ ⇔
  captures = CaptureSet(C) ∧

```text
  Γ ⊢ ClosureEnvLayout(C) ⇓ ⟨size, align, _⟩ ∧
  env_ptr = Alloc(size, align) ∧

```text
  IR = SeqIR(AllocIR(size, align), [StoreCapture(env_ptr, offsets[i], x_i) | x_i ∈ captures, i ∈ 1..|captures|])

```text
StoreCapture(env_ptr, offset, x) = StoreIR(GEP(env_ptr, offset), LoadLocal(x))    if x ∈ RefCaptureSet(C)

```text
StoreCapture(env_ptr, offset, x) = MoveIR(GEP(env_ptr, offset), x)    if x ∈ MoveCaptureSet(C)

```text
IsCaptured(C, x) ⇔ x ∈ CaptureSet(C)

```text
CaptureOffset(C, x) = offset_i ⇔ Γ ⊢ ClosureEnvLayout(C) ⇓ ⟨_, _, offsets⟩ ∧ CaptureList(C) = [x_1, …, x_n] ∧ x = x_i ∧ offsets = [offset_1, …, offset_n]

```text
CaptureList(C) = [x | x ∈ CaptureSet(C)]    (deterministic ordering by lexicographic name)

**(Lower-CapturedIdent-Ref)**

```text
InClosureBody(C)    IsCaptured(C, x)    x ∈ RefCaptureSet(C)    CaptureOffset(C, x) = offset

```text
env_param = ClosureEnvParam    Γ(x) = T_x
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Identifier(x)) ⇓ ⟨SeqIR(LoadIR(GEP(env_param, offset), Ptr<T_x>@Valid), LoadIR(p_capture, T_x)), v_capture⟩

where `p_capture` is the result of the first load and `v_capture` is the result of the second load.

**(Lower-CapturedIdent-Move)**

```text
InClosureBody(C)    IsCaptured(C, x)    x ∈ MoveCaptureSet(C)    CaptureOffset(C, x) = offset

```text
env_param = ClosureEnvParam    Γ(x) = T_x
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Identifier(x)) ⇓ ⟨LoadIR(GEP(env_param, offset), T_x), v_capture⟩

ClosureEnvParam = first parameter of closure code function (the environment pointer)

```text
ClosureCodeSig(C) = (params', R) ⇔
  C.params = params ∧
  C.ret_type_opt = R_opt ∧

```text
  R = (R_opt if R_opt ≠ ⊥ else InferRetType(C.body)) ∧

```text
  params' = CodegenParams([⟨⊥, `__env`, TypeRawPtr(`imm`, TypePrim("u8"))⟩] ++ params)

**(Lower-Closure-Call)**

```text
Γ ⊢ LowerExpr(e_closure) ⇓ ⟨IR_c, v_closure⟩
v_closure = ClosureVal(env_ptr, code_ptr)

```text
Γ ⊢ LowerArgs(args) ⇓ ⟨IR_args, vs⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerClosureCall(e_closure, args) ⇓ ⟨SeqIR(IR_c, IR_args), IndirectCall(code_ptr, [env_ptr] ++ vs)⟩

`LowerClosureCall(e_closure, args)` is the resolved internal lowering form for an ordinary source call `Call(callee, args)` whose callee has closure type. §16.3.6 bridges the source call form to this internal lowering form.

**(Lower-Expr-Pipeline)**

```text
Γ ⊢ LowerExpr(e_1) ⇓ ⟨IR_1, v_1⟩    Γ ⊢ LowerExpr(e_2) ⇓ ⟨IR_2, v_2⟩

```text
IsFunc(ExprType(e_2)) ⇒ IR_call = CallIR(v_2, [v_1])

```text
IsClosure(ExprType(e_2)) ⇒ v_2 = ClosureVal(env, code) ∧ IR_call = IndirectCall(code, [env, v_1])
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(PipelineExpr(e_1, e_2)) ⇓ ⟨SeqIR(IR_1, IR_2, IR_call), v_result⟩

```text
IsFunc(TypeFunc(_, _)) ⇔ true

```text
IsFunc(_) ⇔ false

```text
IsClosure(TypeClosure(_, _, _)) ⇔ true

```text
IsClosure(_) ⇔ false

#### 16.9.7 Diagnostics

Diagnostics are defined for unique captures, closure parameters whose types cannot be inferred, move-capturing a moved binding, move-capturing an immovable binding, reference-capturing a moved binding, pipeline right-hand sides that are not callable, pipeline type mismatch, and pipeline targets that do not accept exactly one argument.

### 16.10 Expression Diagnostics Supplement

This section owns diagnostics for general expression typing, calls, indexing restrictions, and `transmute`.

| Code          | Severity | Detection    | Condition                                                                           |
| ------------- | -------- | ------------ | ----------------------------------------------------------------------------------- |
| `E-SEM-2525`  | Error    | Compile-time | Operator operands are not compatible with the operator's type requirements          |
| `E-SEM-2526`  | Error    | Compile-time | Expression type incompatible with expected type                                     |
| `E-SEM-2527`  | Error    | Compile-time | Indexing applied to non-indexable type                                              |
| `E-SEM-2528`  | Error    | Compile-time | Invalid cast                                                                        |
| `E-SEM-2531`  | Error    | Compile-time | Callee expression is not of FUNCTION type                                           |
| `E-SEM-2532`  | Error    | Compile-time | Argument count mismatch                                                             |
| `E-SEM-2533`  | Error    | Compile-time | Argument type incompatible with parameter type                                      |
| `E-SEM-2534`  | Error    | Compile-time | `move` argument required but not provided for provenance-bearing consuming argument |
| `E-SEM-2535`  | Error    | Compile-time | `move` argument provided but parameter is not `move`                                |
| `E-SEM-2536`  | Error    | Compile-time | Method not found for receiver type                                                  |
| `E-SEM-2538`  | Error    | Compile-time | Pipeline RHS is not callable                                                        |
| `E-SEM-2539`  | Error    | Compile-time | Pipeline argument type mismatch                                                     |
| `E-SEM-2591`  | Error    | Compile-time | Closure parameter type cannot be inferred                                           |
| `E-MEM-3031`  | Error    | Compile-time | `transmute` source and target sizes differ                                          |
| `E-UNS-0102`  | Error    | Compile-time | Array index must be a compile-time constant outside `[[dynamic]]` scope             |
| `E-UNS-0103`  | Error    | Compile-time | Array index out of bounds                                                           |
| `E-UNS-0104`  | Error    | Compile-time | `transmute` source and target alignments differ                                     |
| `E-UNS-0107`  | Error    | Compile-time | Non-`Bitcopy` place expression used as value                                        |
| `W-SAFE-0100` | Warning  | Compile-time | `transmute` target type is known to admit invalid bit patterns                      |
