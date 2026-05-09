---
title: "Parsing and AST Infrastructure"
description: "5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T14:44:07.538Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 5. Parsing and AST Infrastructure

### 5.1 Parsing Inputs, Outputs, and Invariants

```text
ParseInputs(S, K_raw, D, K) ⇔ Γ ⊢ Tokenize(S) ⇓ (K_raw, D) ∧ K = Filter(K_raw)
ParseOutputs(S, F) ⇔ Γ ⊢ ParseFile(S) ⇓ F
```

**Parsing Phase Invariants.**

**(Phase1-File)**

```text
Γ ⊢ ParseFile(S) ⇓ F
```

────────────────────────────

```text
Γ ⊢ ParsePhase(S) ⇓ F
```

**(Phase1-Forward-Refs)**
──────────────────────────────────────────────

```text
Γ ⊢ ParsePhase(S) ⇓ NoResolutionConstraints
```

Construct-specific `ParseItem`, `ParseExpr`, `ParsePattern`, `ParseType`, and `ParseStmt` rules are defined by the owning feature chapters. `ParseModule` and `ParseModules` are defined by §11.5.4.

### 5.2 AST Meta-Conventions

```text
ASTNode = ASTItem ∪ ASTExpr ∪ ASTPattern ∪ ASTType ∪ ASTStmt
SpanOfNode : ASTNode → Span
DocOf : ASTNode → (DocList ∪ {⊥})
```

SpanDefault(P, P') = SpanBetween(P, P')
DocDefault = []

```text
DocOptDefault = ⊥
```

FillSpan(n, P, P') =
 n[span := SpanDefault(P, P')]  if SpanMissing(n)
 n                             otherwise
FillDoc(n) =
 n[doc := DocDefault]  if DocMissing(n)
 n                     otherwise
FillDocOpt(n) =
 n[doc_opt := DocOptDefault]  if DocOptMissing(n)
 n                            otherwise
ParseCtor(n, P, P') = FillDocOpt(FillDoc(FillSpan(n, P, P')))

DocList = [DocComment]

```text
ASTItem ∈ {ImportDecl, UsingDecl, ExternBlock, StaticDecl, ProcedureDecl, CtProc, RecordDecl, EnumDecl, ModalDecl, ClassDecl, TypeAliasDecl, DeriveTargetDecl, ErrorItem}
```

**ErrorItem.**

```text
ErrorItem = ⟨span⟩
```

IsDecl(ErrorItem(_)) = false

**Type.**
Type = {TypePerm(perm, base), TypePrim(name), TypeTuple(elems), TypeArray(elem, size_expr), TypeSlice(elem), TypeUnion(members), TypeFunc(params, ret), TypePath(path), TypeApply(path, args), TypeDynamic(path), TypeOpaque(path), TypeRefine(base, pred), TypeString(string_state_opt), TypeBytes(bytes_state_opt), TypeModalState(modal_ref, state), TypePtr(elem, ptr_state_opt), TypeRawPtr(qual, elem), TypeRange(base), TypeRangeInclusive(base), TypeRangeFrom(base), TypeRangeTo(base), TypeRangeToInclusive(base), TypeRangeFull, TypeClosure(params, ret, deps_opt)}

```text
TypeApply = ⟨path, args⟩
TypeOpaque = ⟨path⟩
TypeRefine = ⟨base, pred⟩
TypeClosure = ⟨params, ret, deps_opt⟩    params ∈ [ParamType], ret ∈ Type, deps_opt ∈ {⊥} ∪ SharedDeps
SharedDep = ⟨name, type⟩ where name ∈ Identifier ∧ type ∈ Type
```

SharedDeps = [SharedDep]
MoveMode = ParamMode

Perm = {`const`, `unique`, `shared`}
Qual = {`imm`, `mut`}

```text
PtrStateOpt = {⊥, `Valid`, `Null`, `Expired`}
StringStateOpt = {⊥, `@Managed`, `@View`}
BytesStateOpt = {⊥, `@Managed`, `@View`}
Name ∈ PrimTypeNames
```

```text
ParamMode = {`move`, ⊥}
ParamType = ⟨mode, type⟩ where mode ∈ ParamMode ∧ type ∈ Type
```

### 5.3 Parser State and Judgments

**Parser State.**

```text
PState = ⟨K, i, D, j, d, Δ⟩
```

TokStream(P) = K
TokIndex(P) = i
DocStream(P) = D
DocIndex(P) = j
Depth(P) = d
DiagStream(P) = Δ

**Helper Functions.**
Tok(P) =
 K[i]                        if i < |K|

```text
 ⟨EOF, ε, EOFSpan(K)⟩        if i = |K|
```

```text
SourceOf(K) = S ⇔ Γ ⊢ Tokenize(S) ⇓ (K_raw, D) ∧ K = Filter(K_raw)
```

EOFSpan(K) = EOFSpan(SourceOf(K))

```text
Advance(P) = ⟨K, i+1, D, j, d, Δ⟩
Clone(P) = ⟨K, i, D, j, d, []⟩
MergeDiag(P_b, P_d, P_s) = ⟨TokStream(P_s), TokIndex(P_s), DocStream(P_s), DocIndex(P_s), Depth(P_s), DiagStream(P_b) ++ DiagStream(P_d)⟩
```

**Parser Index Invariant.**

```text
PStateOk(P) ⇔ 0 ≤ i ≤ |K|
```

AdvanceOrEOF(P) =
 Advance(P)  if i < |K|
 P           if i = |K|

LastConsumed(P, P') =
 K[i'-1]  if i' > i
 Tok(P)   if i' = i

SpanBetween(P, P') = SpanFrom(Tok(P), LastConsumed(P, P'))

SplitSpan2(sp) = (sp_L, sp_R) where

```text
 sp_L.file = sp.file ∧ sp_R.file = sp.file
 sp_L.start_offset = sp.start_offset ∧ sp_L.end_offset = sp.start_offset + 1
 sp_R.start_offset = sp.start_offset + 1 ∧ sp_R.end_offset = sp.start_offset + 2
 sp_L.start_line = sp.start_line ∧ sp_L.end_line = sp.start_line
 sp_R.start_line = sp.start_line ∧ sp_R.end_line = sp.start_line
 sp_L.start_col = sp.start_col ∧ sp_L.end_col = sp.start_col + 1
 sp_R.start_col = sp.start_col + 1 ∧ sp_R.end_col = sp.start_col + 2
```

```text
SplitShiftR(P) = ⟨K', i, D, j, d, Δ⟩
where Tok(P) = ⟨Operator(">>"), ">>", sp⟩ ∧ (sp_L, sp_R) = SplitSpan2(sp)
K' = K[0..i) ++ [⟨Operator(">"), ">", sp_L⟩, ⟨Operator(">"), ">", sp_R⟩] ++ K[i+1..]
```

**Judgments (Big-Step).**
ParseJudgment = {ParseFile, ParseModule, ParseItem, ParseStmt, ParseExpr, ParsePattern, ParseType}

### 5.4 Shared Grammar Policy and Parser Helpers

**Lexeme Predicates.**

```text
IsIdent(t) ⇔ t.kind = Identifier
IsKw(t, s) ⇔ t.kind = Keyword(s)
IsOp(t, s) ⇔ t.kind = Operator(s)
IsPunc(t, s) ⇔ t.kind = Punctuator(s)
```

Lexeme(t) = t.lexeme

**Contextual Keywords.**
CtxKeyword = {"in", "key", "wait"}

```text
Ctx(t, s) ⇔ IsIdent(t) ∧ Lexeme(t) = s ∧ s ∈ CtxKeyword
¬ Ctx(t, "as") ∧ ¬ Ctx(t, "move")
```

**Fixed Identifier Lexemes.**
FixedIdent_Key = {"read", "write", "dynamic", "speculative", "release"}
FixedIdent_Parallel = {"cancel", "name", "workgroup", "workgroups"}
FixedIdent_Spawn = {"name", "affinity", "priority"}
FixedIdent_Dispatch = {"reduce", "ordered", "chunk", "workgroup", "min", "max", "and", "or"}
FixedIdent_Meta = {"pattern", "target", "requires", "emits"}

```text
FixedIdent = FixedIdent_Key ∪ FixedIdent_Parallel ∪ FixedIdent_Spawn ∪ FixedIdent_Dispatch ∪ FixedIdent_Meta
FixedIdentTok(t, s) ⇔ IsIdent(t) ∧ Lexeme(t) = s ∧ s ∈ FixedIdent
```

Fixed identifiers MUST be tokenized as identifiers and are disambiguated by syntactic position.

**Union Propagation.**

```text
UnionPropTok(t) ⇔ IsOp(t, "?")
UnionPropForm(e) ⇔ ∃ e_0. e = Propagate(e_0)
```

**Type Tokens.**

```text
TypePredicateTok(t) ⇔ IsOp(t, "|:")
OpaqueTypeTok(t) ⇔ IsIdent(t) ∧ Lexeme(t) = "opaque"
TypeArgsStartTok(t) ⇔ IsOp(t, "<")
```

Trailing comma rules are defined by §5.5.

**(Parse-Ident)**
IsIdent(Tok(P))
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseIdent(P) ⇓ (Advance(P), Lexeme(Tok(P)))
```

**(Parse-Ident-Err)**

```text
¬ IsIdent(Tok(P))    c = Code(Parse-Syntax-Err)    Γ ⊢ Emit(c, Tok(P).span)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseIdent(P) ⇓ (P, "_")
```

**(Parse-TypePath)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, id)    Γ ⊢ ParseTypePathTail(P_1, [id]) ⇓ (P_2, path)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTypePath(P) ⇓ (P_2, path)
```

**(Parse-ClassPath)**

```text
Γ ⊢ ParseTypePath(P) ⇓ (P_1, path)
```

────────────────────────────────────────────

```text
Γ ⊢ ParseClassPath(P) ⇓ (P_1, path)
```

**(Parse-TypePathTail-End)**

```text
¬ IsOp(Tok(P), "::")
```

────────────────────────────────────────────

```text
Γ ⊢ ParseTypePathTail(P, xs) ⇓ (P, xs)
```

**(Parse-TypePathTail-Cons)**

```text
IsOp(Tok(P), "::")    Γ ⊢ ParseIdent(Advance(P)) ⇓ (P_1, id)    Γ ⊢ ParseTypePathTail(P_1, xs ++ [id]) ⇓ (P_2, ys)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTypePathTail(P, xs) ⇓ (P_2, ys)
```

**(Parse-QualifiedHead)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, id_0)    IsOp(Tok(P_1), "::")    Γ ⊢ ParseModulePathTail(P_1, [id_0]) ⇓ (P_2, xs)    xs = ys ++ [name]    |xs| ≥ 2
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseQualifiedHead(P) ⇓ (P_2, ys, name)
```

**(Parse-Vis-Opt)**

```text
IsKw(Tok(P), v)    v ∈ {`public`, `internal`, `private`}
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseVis(P) ⇓ (Advance(P), v)
```

**(Parse-Vis-Default)**

```text
¬ IsKw(Tok(P), v)
```

──────────────────────────────────────────

```text
Γ ⊢ ParseVis(P) ⇓ (P, `internal`)
```

**(Parse-ModalOpt-Yes)**
IsKw(Tok(P), `modal`)
────────────────────────────────────────────

```text
Γ ⊢ ParseModalOpt(P) ⇓ (Advance(P), true)
```

**(Parse-ModalOpt-No)**

```text
¬ IsKw(Tok(P), `modal`)
```

────────────────────────────────────────────

```text
Γ ⊢ ParseModalOpt(P) ⇓ (P, false)
```

**(Parse-AliasOpt-None)**

```text
¬ IsKw(Tok(P), `as`)
```

───────────────────────────────────────────

```text
Γ ⊢ ParseAliasOpt(P) ⇓ (P, ⊥)
```

**(Parse-AliasOpt-Yes)**

```text
IsKw(Tok(P), `as`)    Γ ⊢ ParseIdent(Advance(P)) ⇓ (P_1, id)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAliasOpt(P) ⇓ (P_1, id)
```

**(Parse-TypeAnnotOpt-None)**

```text
¬ IsPunc(Tok(P), ":")
```

─────────────────────────────────────────────

```text
Γ ⊢ ParseTypeAnnotOpt(P) ⇓ (P, ⊥)
```

**(Parse-TypeAnnotOpt-Yes)**

```text
IsPunc(Tok(P), ":")    Γ ⊢ ParseType(Advance(P)) ⇓ (P_1, ty)
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTypeAnnotOpt(P) ⇓ (P_1, ty)
```

**(Parse-KeyBoundaryOpt-Yes)**
IsOp(Tok(P), "#")
────────────────────────────────────────────

```text
Γ ⊢ ParseKeyBoundaryOpt(P) ⇓ (Advance(P), true)
```

**(Parse-KeyBoundaryOpt-No)**

```text
¬ IsOp(Tok(P), "#")
```

────────────────────────────────────────────

```text
Γ ⊢ ParseKeyBoundaryOpt(P) ⇓ (P, false)
```

### 5.5 Token Consumption and List Parsing

ConsumeState = {Consume(P, k), ConsumeDone(P)}
ParseRejectRules = ∅

**(Tok-Consume-Kind)**
Tok(P).kind = k
────────────────────────────────────────────────

```text
⟨Consume(P, k)⟩ → ⟨ConsumeDone(Advance(P))⟩
```

**(Tok-Consume-Keyword)**
IsKw(Tok(P), s)
────────────────────────────────────────────────────────────

```text
⟨Consume(P, Keyword(s))⟩ → ⟨ConsumeDone(Advance(P))⟩
```

**(Tok-Consume-Operator)**
IsOp(Tok(P), s)
────────────────────────────────────────────────────────────

```text
⟨Consume(P, Operator(s))⟩ → ⟨ConsumeDone(Advance(P))⟩
```

**(Tok-Consume-Punct)**
IsPunc(Tok(P), s)
────────────────────────────────────────────────────────────

```text
⟨Consume(P, Punctuator(s))⟩ → ⟨ConsumeDone(Advance(P))⟩
```

**List Parsing (Small-Step)**
ListState = {ListStart(P), ListScan(P, xs), ListDone(P, xs)}

**(List-Start)**
────────────────────────────────────────

```text
⟨ListStart(P)⟩ → ⟨ListScan(P, [])⟩
```

**(List-Cons)**

```text
Γ ⊢ ParseElem(P) ⇓ (P', x)
```

──────────────────────────────────────────────────────

```text
⟨ListScan(P, xs)⟩ → ⟨ListScan(P', xs ++ [x])⟩
```

**(List-Done)**

```text
Tok(P) ∈ EndSet
```

──────────────────────────────────────

```text
⟨ListScan(P, xs)⟩ → ⟨ListDone(P, xs)⟩
```

```text
EndSet ⊆ TokenKind
```

In list parsing rules, P_0 denotes the parser state immediately after consuming the list opening delimiter for the list being parsed.

```text
TrailingComma(P, EndSet) ⇔ IsPunc(Tok(P), ",") ∧ Tok(Advance(P)) ∈ EndSet
TokensBetween(P_0, P) = ⟨TokIndex(P_0), TokIndex(P)⟩
```

TokLine(t) = t.span.start_line

```text
TrailingCommaAllowed(P_0, P, EndSet) ⇔ TrailingComma(P, EndSet) ∧ TokLine(Tok(P)) < TokLine(Tok(Advance(P)))
```

**(Trailing-Comma-Err)**

```text
TrailingComma(P, EndSet)    ¬ TrailingCommaAllowed(P_0, P, EndSet)    c = Code(Trailing-Comma-Err)
```

─────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(c, Tok(P).span)
```

### 5.6 ParseFile, Item Sequencing, and Terminators

**ParseFile (Big-Step).**

```text
Γ ⊢ Tokenize(S) ⇓ (K_raw, D)
```

K = Filter(K_raw)

```text
P_0 = ⟨K, 0, D, 0, 0, []⟩
```

**(ParseFile-Ok)**

```text
Γ ⊢ ParseItems(P_0) ⇓ (P_1, I, MDoc)
```

────────────────────────────────────────────────

```text
Γ ⊢ ParseFile(S) ⇓ ⟨S.path, I, MDoc⟩
```

**Item Sequence (Big-Step).**

**(ParseItems-Empty)**
Tok(P) = EOF
──────────────────────────────────────

```text
Γ ⊢ ParseItems(P) ⇓ (P, [], [])
```

**(ParseItems-Cons)**

```text
Tok(P) ≠ EOF    Γ ⊢ ParseItem(P) ⇓ (P_1, it)    Γ ⊢ ParseItems(P_1) ⇓ (P_2, I, M)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItems(P) ⇓ (P_2, [it] ++ I, M)
```

**Statement Terminators.**
StmtTerm = {Punctuator(";"), Newline}

```text
IsTerm(t) ⇔ t ∈ StmtTerm
```

```text
ReqTerm(s) ⇔ s ∈ {LetStmt(_), VarStmt(_), UsingLocalStmt(_, _, _), AssignStmt(_, _), CompoundAssignStmt(_, _, _), ExprStmt(_)}
```

**(ConsumeTerminatorOpt-Req-Yes)**
ReqTerm(s)    IsTerm(Tok(P))
──────────────────────────────────────────────

```text
Γ ⊢ ConsumeTerminatorOpt(P, s) ⇓ Advance(P)
```

**(ConsumeTerminatorOpt-Req-No)**

```text
ReqTerm(s)    ¬ IsTerm(Tok(P))    Emit(Code(Missing-Terminator-Err), Span = Tok(P).span)    Γ ⊢ SyncStmt(P) ⇓ P_1
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ConsumeTerminatorOpt(P, s) ⇓ P_1
```

**(ConsumeTerminatorOpt-Opt-Yes)**

```text
¬ ReqTerm(s)    IsTerm(Tok(P))
```

──────────────────────────────────────────────

```text
Γ ⊢ ConsumeTerminatorOpt(P, s) ⇓ Advance(P)
```

**(ConsumeTerminatorOpt-Opt-No)**

```text
¬ ReqTerm(s)    ¬ IsTerm(Tok(P))
```

──────────────────────────────────────────────

```text
Γ ⊢ ConsumeTerminatorOpt(P, s) ⇓ P
```

**(ConsumeTerminatorReq-Yes)**

```text
Tok(P) ∈ {Punctuator(";"), Newline}
```

──────────────────────────────────────────────

```text
Γ ⊢ ConsumeTerminatorReq(P) ⇓ Advance(P)
```

**(ConsumeTerminatorReq-No)**

```text
Tok(P) ∉ {Punctuator(";"), Newline}    c = Code(Missing-Terminator-Err)    Γ ⊢ Emit(c, Tok(P).span)    Γ ⊢ SyncStmt(P) ⇓ P_1
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ConsumeTerminatorReq(P) ⇓ P_1
```

### 5.7 Doc Comment Association

DocSeq(D) = D
ItemSeq(Items) = Items

**(Attach-Doc-Line)**

```text
d.kind = LineDoc    Items = [i_1, …, i_k]    j = min{ t | d.span.end_offset ≤ i_t.span.start_offset }
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ AttachDoc(d, i_j)
```

```text
LineDocTarget(d, Items) = i_j ⇔ Γ ⊢ AttachDoc(d, i_j)
LineDocsFor(i, D, Items) = [d ∈ D | d.kind = LineDoc ∧ LineDocTarget(d, Items) = i]
```

**(Attach-Doc-Module)**
d.kind = ModuleDoc
──────────────────────────────────────────────

```text
Γ ⊢ AttachModuleDoc(d)
```

```text
ModuleDocs(D) = [d ∈ D | d.kind = ModuleDoc]
```

### 5.8 Error Recovery and Synchronization

**Statement Synchronization Set.**
SyncStmt = {Punctuator(";"), Newline, Punctuator("}"), EOF}

**Item Synchronization Set.**
SyncItem = {Keyword(`procedure`), Keyword(`record`), Keyword(`enum`), Keyword(`modal`), Keyword(`class`), Keyword(`type`), Keyword(`using`), Keyword(`let`), Keyword(`var`), Punctuator("}"), EOF}

**Type Synchronization Set.**
SyncType = {Punctuator(","), Punctuator(";"), Newline, Punctuator(")"), Punctuator("]"), Punctuator("}"), EOF}

**(Sync-Stmt-Stop)**

```text
Tok(P) ∈ {Punctuator("}"), EOF}
```

──────────────────────────────────────────────

```text
Γ ⊢ SyncStmt(P) ⇓ P
```

**(Sync-Stmt-Consume)**

```text
Tok(P) ∈ {Punctuator(";"), Newline}
```

──────────────────────────────────────────────

```text
Γ ⊢ SyncStmt(P) ⇓ Advance(P)
```

**(Sync-Stmt-Advance)**

```text
Tok(P) ∉ SyncStmt
```

──────────────────────────────────────────────

```text
Γ ⊢ SyncStmt(P) ⇓ SyncStmt(Advance(P))
```

**(Sync-Item-Stop)**

```text
Tok(P) ∈ SyncItem
```

──────────────────────────────────────────────

```text
Γ ⊢ SyncItem(P) ⇓ P
```

**(Sync-Item-Advance)**

```text
Tok(P) ∉ SyncItem
```

──────────────────────────────────────────────

```text
Γ ⊢ SyncItem(P) ⇓ SyncItem(Advance(P))
```

**(Sync-Type-Stop)**

```text
Tok(P) ∈ {Punctuator(")"), Punctuator("]"), Punctuator("}"), EOF}
```

──────────────────────────────────────────────

```text
Γ ⊢ SyncType(P) ⇓ P
```

**(Sync-Type-Consume)**

```text
Tok(P) ∈ {Punctuator(","), Punctuator(";"), Newline}
```

──────────────────────────────────────────────

```text
Γ ⊢ SyncType(P) ⇓ Advance(P)
```

**(Sync-Type-Advance)**

```text
Tok(P) ∉ SyncType
```

──────────────────────────────────────────────

```text
Γ ⊢ SyncType(P) ⇓ SyncType(Advance(P))
```

StmtParseErrRule = Parse-Statement-Err
ItemParseErrRule = Parse-Item-Err

### 5.9 Parsing Diagnostics

Phase1DiagRules = {Missing-Terminator-Err, Trailing-Comma-Err, Parse-Syntax-Err}

**(Parse-Syntax-Err)**
GenericParseRules = {Parse-Ident-Err, Parse-Type-Err, Parse-Pattern-Err, Parse-Primary-Err, Parse-Statement-Err, Parse-Item-Err}

```text
r ∈ GenericParseRules    PremisesHold(r, P)
```

────────────────────────────────────────────────

```text
Γ ⊢ Emit(Code(Parse-Syntax-Err))
```

### 5.10 Parsing Diagnostics Supplement

This section owns parser-level diagnostics that are shared across feature chapters and therefore are not duplicated in feature-local diagnostic tables.

| Code         | Severity | Detection    | Condition                               |
| ------------ | -------- | ------------ | --------------------------------------- |
| `E-CNF-0401` | Error    | Compile-time | Reserved keyword used as identifier     |
| `E-SRC-0510` | Error    | Compile-time | Missing statement terminator            |
| `E-SRC-0520` | Error    | Compile-time | Generic syntax error (unexpected token) |
| `E-SRC-0521` | Error    | Compile-time | Trailing comma in single-line list      |
