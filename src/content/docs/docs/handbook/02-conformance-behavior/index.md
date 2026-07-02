---
title: "2. Conformance, Behavior Types & the Phase Model"
description: "Chapter 02 of the Ultraviolet Developer Handbook."
handbookSource: "handbook/02-conformance-behavior.md"
handbookHash: "a5d21aff583bfbb6d9db8ef52b842fec80adad1864f5846488ab5bc00e090e24"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from 02-conformance-behavior.md.</strong>
  <span>Handbook SHA-256: <code>a5d21aff583bfbb6d9db8ef52b842fec80adad1864f5846488ab5bc00e090e24</code></span>
</div>

This chapter defines what it means for an Ultraviolet program to *conform* to the
language specification, the formal taxonomy of *behavior* the specification
recognizes (well-defined, ill-formed, statically-undefined, runtime-checked,
implementation-defined, and outside-conformance), the document conventions and
normative references that fix the meaning of every requirement, the four-phase
translation model that determines what runs at compile time versus run time, and
the target/ABI assumptions a conforming compilation rests on. These are the rules
that decide whether code you write will *compile at all*, and — once it compiles —
what guarantees the language makes about how it runs. Everything in later chapters
(types, permissions, modal protocols, contracts, regions, FFI) is layered on top of
the vocabulary established here.

Two ideas thread through the whole chapter and should be kept in mind:

- **Conformance is a property of a whole program (project), not of a file.** The
  specification defines `Conforming(P)` over a project `P`, and a project either is
  or is not well-formed.
- **Behavior is categorized formally.** The specification does not use loose words
  like "bad code." Each category is a precise predicate over judgments and rules.
  Knowing which category a construct falls into tells you whether to defend against
  it with a contract, rely on a static guarantee, or treat it as a hard
  never-do-this boundary.

This chapter corresponds to specification §1, "Conformance and Notation": §1.1
(Conformance), §1.2 (Behavior Types), §1.3 (Document Conventions), §1.4 (Normative
References), §1.5 (Compile-Time Execution and Phase Ordering), and §1.6 (Target and
ABI Assumptions).

### 2.1 Conformance (§1.1)

#### 2.1.1 The conformance predicate

A program conforms exactly when it is well-formed. The specification states this as
a biconditional:

```text
Conforming.
Conforming(P) ⇔ WF(P)
```

`P` ranges over *projects* — the entire unit of compilation, not a single source
file. (The chapter "Projects, Modules & the Build Model" covers what a project is
and how `Ultraviolet.toml` assembles one; here we only need that `P` is the whole
thing.)

Well-formedness is itself defined in terms of a typing/elaboration environment `Γ`
and a fixed list of *required judgments*:

```text
WF.
WF(P) ⇔ ∃ Γ. Project(Γ) = P ∧ ∀ j ∈ ReqJudgments(P). Γ ⊢ j ⇓ ok

ReqJudgments.
ReqJudgments(P) = [Phase1Order(P), Phase2Order(P), Phase3Order(P), Phase4Order(P)]
```

Read this operationally: a project is well-formed iff there exists an environment
`Γ` whose project is `P`, and under that environment **every one of the four
phase-order judgments holds (`⇓ ok`)**. The four required judgments are exactly the
four translation phases (§2.5 of this chapter). If any phase's order judgment fails,
`WF(P)` is false, `Conforming(P)` is false, and the program is **not** a legal
Ultraviolet program.

#### 2.1.2 The phase-order judgments

The four required judgments are *cumulative*: each later phase re-establishes the
earlier ones and adds its own obligation. Reproduced verbatim from §1.1:

```text
Phase1Order.
Γ ⊢ Phase1Order(P) ⇓ ok ⇔ ∃ Ms. Γ ⊢ ParseModules(P) ⇓ Ms

Phase2Order.
Γ ⊢ Phase2Order(P) ⇓ ok ⇔ ∃ Ms, Ms_ct. Γ ⊢ ParseModules(P) ⇓ Ms ∧ Γ ⊢ ExecuteComptime(P, Ms) ⇓ Ms_ct
```

```text
Phase3Checks(P, Ms_ct, Ms_res) = [Γ_ct ⊢ ResolveModules(P_ct) ⇓ Ms_res, Γ_res ⊢ DeclTyping(Ms_res) ⇓ ok, Γ_res ⊢ MainCheck(P_res) ⇓ ok]
 where
  P_ct = ProjectView(P, Ms_ct)
  Γ_ct = Γ[project ↦ P_ct]
  P_res = ProjectView(P, Ms_res)
  Γ_res = Γ[project ↦ P_res]
Γ ⊢ Phase3Order(P) ⇓ ok ⇔ ∃ Ms, Ms_ct, Ms_res. Γ ⊢ ParseModules(P) ⇓ Ms ∧ Γ ⊢ ExecuteComptime(P, Ms) ⇓ Ms_ct ∧ FirstFail(Phase3Checks(P, Ms_ct, Ms_res)) = ⊥
```

```text
Phase4Order.
Γ ⊢ Phase4Order(P) ⇓ ok ⇔ ∃ Ms, Ms_ct, Ms_res, Objs, IRs, Artifact. Γ ⊢ ParseModules(P) ⇓ Ms ∧ Γ ⊢ ExecuteComptime(P, Ms) ⇓ Ms_ct ∧ FirstFail(Phase3Checks(P, Ms_ct, Ms_res)) = ⊥ ∧ P_res = ProjectView(P, Ms_res) ∧ Γ_res = Γ[project ↦ P_res] ∧ Γ_res ⊢ OutputPipeline(P_res) ⇓ (Objs, IRs, Artifact)
```

Key facts to internalize:

- **`Ms` / `Ms_ct` / `Ms_res`** are the module set at successive stages: raw parsed
  (`Ms`), after compile-time execution expands it (`Ms_ct`), and after name
  resolution (`Ms_res`).
- **`Phase3Checks` is an ordered list** of three sub-judgments — module resolution
  (`ResolveModules`), declaration typing (`DeclTyping`), and the entry-point check
  (`MainCheck`). `FirstFail(...) = ⊥` means *none of them failed*. The ordering
  matters for diagnostics: resolution is checked before typing, typing before the
  `main` check.
- **`ProjectView(P, Ms')`** rebinds the project to use an updated module set, and
  `Γ[project ↦ P']` updates the environment to match. This is how a phase "hands
  off" its expanded program to the next phase.
- **`OutputPipeline`** (Phase 4) is the only phase that produces artifacts:
  `(Objs, IRs, Artifact)` — object files, IR, and the final artifact.

#### 2.1.3 Translation phases and rejection

The four phases are named and ordered:

```text
TranslationPhases.
TranslationPhases = [Phase1, Phase2, Phase3, Phase4]
```

When a project is not conforming, the specification mandates rejection:

```text
(Reject-IllFormed)
¬ Conforming(P)
─────────────────
Γ ⊢ Reject(P)
```

There is no "best effort" compilation of a non-conforming project. A conforming
implementation that detects `¬ Conforming(P)` MUST reject `P`. For you as an author,
this means: **a compile error is not advisory.** If the program is ill-formed, no
artifact is produced.

#### 2.1.4 The entry-point check (`MainCheck`)

Because `MainCheck` is one of the three `Phase3Checks`, the shape of an executable's
entry point is part of conformance, and it is worth fixing precisely here so the
examples in this chapter are correct.

`MainCheck` only constrains *executable* projects. The specification defines:

```text
Executable(P) ⇔ P.assembly.kind = `executable`
```

For a non-executable assembly (a `library` or `dependency`), `Main-Bypass-NonExecutable`
makes `MainCheck` succeed unconditionally — there is no `main` requirement. For an
executable, exactly one acceptable `main` must exist. The signature predicate is:

```text
MainSigOk(d) ⇔ d = ProcedureDecl(_, vis, `main`, _, _, params, ret_opt, _, _, _, _) ∧ vis = `public` ∧ params = [⟨mode, name, ty⟩] ∧ mode ∈ {⊥, `move`} ∧ ContextBundleType(StripPerm(ty)) ∧ ret_opt = TypePrim("i32")
```

So a conforming `main` MUST be `public`, MUST return `i32`, and MUST take **exactly
one parameter** whose type is a *context bundle*. The simplest context bundle type
is the built-in `Context`:

```text
ContextBundleType(T) ⇔ AliasNorm(T) = TypePath(["Context"])
```

`Context` is a built-in record path (no import is required to name it). Therefore the
minimal valid entry point is:

```ultraviolet
public procedure main(ctx: Context) -> i32 {
    let exit_code: i32 = 0
    return exit_code
}
```

A zero-parameter `main`, a `main` that returns anything other than `i32`, a
non-`public` `main`, a generic `main`, or more than one `main` in an executable each
fails `MainCheck` and makes the project ill-formed (diagnostics `Main-Signature-Err`,
`Main-Generic-Err`, `Main-Multiple`, `Main-Missing`). The leading parameter MAY use
`move` mode (`mode ∈ {⊥, move}`); the projected-bundle form (a record whose fields
are themselves context-bundle fields) is covered in the capabilities chapter.

#### 2.1.5 Constructs (the conformance surface)

§1.1 also defines the *constructs* a program uses. This machinery exists so the
specification (and tooling) can talk precisely about *which language features a
given project actually exercises*. The total set is:

```text
Constructs(P) = TopDeclConstructs(P) ∪ TypeConstructs(P) ∪ PermConstructs(P) ∪ ExprStmtConstructs(P) ∪ CapConstructs(P)
```

The five components classify, respectively, top-level declaration kinds
(`TopDeclConstructs`), type constructors (`TypeConstructs`), permissions
(`PermConstructs`), expression/statement kinds (`ExprStmtConstructs`), and capability
classes (`CapConstructs`) that appear anywhere in the project's AST. A few
representative classifier definitions, verbatim, show the shape:

```text
ItemKind(ProcedureDecl(_, _, _, _, _, _, _, _, _, _, _)) = `procedure`
ItemKind(RecordDecl(_, _, _, _, _, _, _, _, _, _)) = `record`
ItemKind(EnumDecl(_, _, _, _, _, _, _, _, _, _)) = `enum`
ItemKind(ModalDecl(_, _, _, _, _, _, _, _, _, _)) = `modal`
ItemKind(ClassDecl(_, _, _, _, _, _, _, _, _, _)) = `class`
```

```text
StmtKind(LetStmt(_)) = `let`
StmtKind(VarStmt(_)) = `var`
StmtKind(AssignStmt(_, _)) = `assign`
StmtKind(DeferStmt(_)) = `defer`
StmtKind(RegionStmt(_, _, _)) = `region`
StmtKind(ReturnStmt(_)) = `return`
StmtKind(BreakStmt(_)) = `break`
StmtKind(ContinueStmt) = `continue`
```

You do not write `Constructs(P)` yourself; it is derived from your code. Its
practical relevance is that the specification's *behavior taxonomy* (next section)
and its diagnostics are stated relative to these construct kinds. When a later
chapter says "the `region` statement," it means exactly the construct
`StmtKind(RegionStmt(_, _, _)) = ``region```.

### 2.2 Behavior Types (§1.2)

This is the heart of the chapter. Ultraviolet does **not** use the C/C++ vocabulary
of four loosely-defined behavior classes. Instead it defines each behavior category
as a precise predicate. The categories that matter for writing correct code are:

1. **Well-defined behavior** — the program's judgments hold and the specification
   fixes the result.
2. **Ill-formed** — a static rule applies but its premises do not hold; the program
   is rejected at compile time.
3. **Statically-undefined** — a rule's premise is the undefined marker `⊥`; the
   construct has no defined static meaning and a diagnostic is emitted.
4. **Runtime-checked behavior** — a defined check that, if violated at run time,
   produces a *panic* (deterministic, defined failure).
5. **Implementation-defined behavior** — the specification permits a choice but
   requires it be made consistently (e.g. some resolution strategies).
6. **OutsideConformance** — the specification imposes *no* requirements at all;
   anything may happen. This is Ultraviolet's analogue of "undefined behavior," and
   it is the category to design code so it can never reach.

Each is defined below.

#### 2.2.1 Ill-formed programs

A construct is *ill-formed* when there exists a static rule that *applies* to it but
whose premises do **not** hold. The specification builds this from a large set of
static judgment families gathered into `StaticJudgSet`, the rules concluding them
(`StaticRuleSet`), and supporting definitions. Reproduced verbatim:

```text
StaticRuleSet = { r | Conclusion(r) ∈ StaticJudgSet }
Conclusion(r) = J    (r is written (π_1 … π_k) / J)
Premises(r) = [π_1, …, π_k]    (r is written (π_1 … π_k) / _)
Subject(Γ ⊢ j) = j_0 where j_0 is the leftmost term to the right of ⊢
EnvOf(Γ ⊢ j) = Γ
θ ranges over substitutions of metavariables in r
Applies(r, x) ⇔ ∃ θ. Subject(Conclusion(r)[θ]) = x
PremisesHold(r, x) ⇔ ∃ θ. Subject(Conclusion(r)[θ]) = x ∧ Γ_r = EnvOf(Conclusion(r)[θ]) ∧ ∀ π ∈ Premises(r)[θ]. π ≠ ⊥ ∧ (π is a judgment ⇒ Γ_r ⊢ π)
IllFormed(x) ⇔ ∃ r ∈ StaticRuleSet. Applies(r, x) ∧ ¬ PremisesHold(r, x)
```

In plain terms: a rule `r` has a conclusion `J` and a list of premises. `r` *applies*
to a construct `x` when some substitution `θ` makes the conclusion's subject equal
`x`. Its premises *hold* when every premise is not the undefined marker `⊥` **and**
every premise that is itself a judgment is derivable under the rule's environment.
`IllFormed(x)` holds when a rule applies but its premises fail to hold.

The consequence is decisive: an ill-formed construct makes `WF(P)` false, so the
project is rejected (`Reject-IllFormed`, §2.1.3). **Ill-formed = does not compile.**

`StaticJudgSet` is the union of a very large family of judgment kinds. Representative
members (from the specification's `StaticJudgSet`) include parsing (`ParseJudgment`),
path resolution (`ResolvePathJudg`), type equality and subtyping (`TypeEqJudg`,
`SubtypingJudg`), permission admission (`PermAdmitsJudg`), provenance/escape
(`ProvPlaceJudg`, `ProvExprJudg`, `ProvStmtJudg`, `BlockProvJudg`), pattern and
expression typing (`PatJudg`, `ExprJudg`, `CaseJudg`, `DeclJudg`), FFI safety
(`FfiSafeJudg`), and the whole layout/ABI/codegen family (`LayoutJudg`, `ABITyJudg`,
`CodegenJudg`, `LowerExprJudg`, and so on). Anything those rules govern is checked
statically; violating one is ill-formedness, not a runtime surprise.

**What this means for you:** prefer to encode rules so that breaking them is
*ill-formed* rather than merely a runtime failure. The style guide makes this
explicit: "If a rule about safety, range, state, ownership, lifetime, authority, or
valid sequencing can be expressed with contracts or invariants, express it in code."
A static rejection is strictly better than a runtime panic, which is strictly better
than `OutsideConformance`.

#### 2.2.2 Statically-undefined behavior

A judgment is *statically undefined* when a rule concludes it but one of that rule's
premises is the undefined marker `⊥`:

```text
Undefinedness Policy.
StaticUndefined(J) ⇔ ∃ r. Conclusion(r) = J ∧ ∃ π ∈ Premises(r). π = ⊥
```

Unlike `IllFormed` (premises *fail to hold*), `StaticUndefined` means the rule
itself is incomplete for this case — the construct has no defined static meaning.
Each statically-undefined judgment is mapped to a diagnostic. The diagnostic
plumbing:

```text
RuleId(r) = id ⇔ r is labeled (id)
DiagIdOf(J) = id ⇔ ∃ r. Conclusion(r) = J ∧ RuleId(r) = id
DiagIdOf(J) = ⊥ ⇔ ¬ ∃ r. Conclusion(r) = J ∧ RuleId(r) defined
```

The two emission rules cover whether a diagnostic code exists for that rule:

```text
(Static-Undefined)
StaticUndefined(J)    Code(DiagIdOf(J)) = c
───────────────────────────────────────
Γ ⊢ J ⇑ c
```

```text
(Static-Undefined-NoCode)
StaticUndefined(J)    Code(DiagIdOf(J)) = ⊥
────────────────────────────────────────
Γ ⊢ J ⇑
```

The `⇑` symbol denotes diagnostic emission (it "raises" the judgment as a
diagnostic). If the responsible rule has an assigned diagnostic code `c`, the
emission carries that code (`⇑ c`); otherwise it emits without a code (`⇑`). Either
way, the program does not advance — statically-undefined judgments are surfaced at
compile time, not silently accepted.

A concrete instance occurs in array-length evaluation. The specification's
`ConstLen-Comptime` note states that array-length evaluation "occurs during Phase 3
over the Phase-2-expanded module set; any `CtBuiltinCall` that requires capabilities
or emission leaves `CtEval` undefined, so `ConstLen-Err` applies." That is exactly
the `StaticUndefined` mechanism: the premise that would evaluate the length is `⊥`,
so a diagnostic (`E-TYP-1810`, "Array length is not a compile-time constant") is
emitted instead of a meaningless layout.

#### 2.2.3 OutsideConformance (the "anything may happen" category)

This is the category to fear and design out of existence:

```text
OutsideConformance.
If OutsideConformance holds, this specification imposes no requirements on observable behavior, diagnostics, or termination. Implementations MAY exhibit any behavior.
```

When `OutsideConformance` holds, **no guarantees apply at all** — not on results,
not on diagnostics, not even on termination. This is the closest analogue to C's
"undefined behavior," and the language is deliberate that you only reach it by
crossing an explicit unsafe boundary or exhausting resources. The specification ties
two concrete situations to it. Resource exhaustion:

```text
ResourceExhaustion ⇒ OutsideConformance
```

and, from the region chapter (a representative unsafe boundary, quoted verbatim):

> Uses of non-pointer values with provenance `π_Region(r)` after reset/free are
> `OutsideConformance`.

The practical rule is the style guide's: treat `unsafe` and the dynamic-dispatch
attribute (`#dynamic`, written `[[dynamic]]` in the style guide's notation) as
"deliberate boundary tools, not convenience escapes," keep `unsafe` blocks "as small
and local as possible," and "wrap unsafe operations in safe APIs that re-establish
project invariants." Safe Ultraviolet — code that uses no `unsafe`, respects
permissions and provenance, and stays within resource limits — does not enter
`OutsideConformance`. The categories that *can* reach it are exactly the
boundary-tool categories.

#### 2.2.4 Static versus runtime checks

The specification partitions the language's safety checks into two sets: those
discharged at compile time and those enforced at run time.

```text
Static vs. Runtime Checks.
CheckKind = {PatternExhaustiveness, TypeCompatibility, PermissionViolations, ProvenanceEscape, ArrayBounds, SafePointerValidity, IntegerOverflow, SliceBounds, IntDivisionByZero, ShiftRange, CastRange}

StaticCheck = {PatternExhaustiveness, TypeCompatibility, PermissionViolations, ProvenanceEscape, ArrayBounds, SafePointerValidity}
RuntimeCheck = {IntegerOverflow, SliceBounds, IntDivisionByZero, ShiftRange, CastRange}
```

`StaticCheck` violations are **ill-formedness** — they are caught by Phase 3 and
reject the program. Notably this includes **`ArrayBounds`** (fixed-array indexing
with a statically-known length) and **`SafePointerValidity`**: where the index or
pointer state is statically known, the violation is a compile error, not a panic.

`RuntimeCheck` violations are enforced while the program runs, and every one of them
*panics* (a defined, deterministic failure — **not** `OutsideConformance`):

```text
RuntimeBehavior(IntegerOverflow) = Panic
RuntimeBehavior(SliceBounds) = Panic
RuntimeBehavior(IntDivisionByZero) = Panic
RuntimeBehavior(ShiftRange) = Panic
RuntimeBehavior(CastRange) = Panic
```

A *panic* is a well-defined behavior: the specification fixes that these conditions
abort deterministically rather than corrupting state or proceeding nondeterminately.
The complete panic taxonomy (reasons, codes, lowering sites) lives in §24.5.2 — see
the chapter on "Runtime Semantics, Panics & Diagnostics." Note the contrast with
`OutsideConformance`: a divide-by-zero is a *guaranteed* panic, whereas a use of a
freed region pointer is `OutsideConformance`. The first is defended by structure; the
second must be prevented entirely.

**Design implication.** Because runtime checks panic, an unhandled out-of-bounds
slice index or an integer overflow is a *crash*, not a silent miscompute. Defensive
code is therefore about avoiding the panic condition (range contracts, validated
indices, modal pointer states), not about catching a corrupted result. Where the
length or state is statically known, push the check into `StaticCheck` territory so
it becomes a compile error instead.

#### 2.2.5 Implementation-defined behavior

Some points are left to the implementation but must be chosen and applied
consistently. The specification flags these explicitly with the phrase
"implementation-defined." For example, the resolution chapter states for a
particular name resolution:

> Resolution strategy is implementation-defined and MAY be lazy.

Implementation-defined is distinct from `OutsideConformance`: the *result* is still
constrained (the resolution must still produce a correct binding), only the
*strategy* is free. Portable code MUST NOT depend on which permitted strategy an
implementation picks. When you see "implementation-defined" in the specification,
read it as: "correct programs work under every permitted choice; do not rely on a
specific one."

#### 2.2.6 Error recovery and diagnostic limits

Even within a single rejected compilation, the specification fixes how the compiler
recovers so it can report multiple errors:

```text
Error Recovery.
LexRecovery = SkipToNextTokenStart
ParseRecovery = SyncSet({`;`, `}`, `EOF`})
TypeRecovery = ContinueDecls
MaxErrorCount ∈ ℕ ∪ {∞}
SuggestedMaxErrorCount = 100
AbortOnErrorCount(n) ⇔ n ≥ MaxErrorCount
```

Lexing recovers by skipping to the next token start; parsing resynchronizes on `;`,
`}`, or `EOF`; type checking continues with later declarations
(`TypeRecovery = ContinueDecls`). The compiler may stop after `MaxErrorCount` errors
(suggested 100). This is why a single mistake often yields one focused diagnostic
rather than a cascade, and why your fix-and-rebuild loop sees the *first* real error
clearly.

#### 2.2.7 Worked example: choosing the right behavior category

The following compiles, and illustrates pushing rules from runtime into static
territory. The array index and the pointer state are statically known, so the
violations they would commit are `StaticCheck`s (compile errors), not runtime panics;
the division guard turns a would-be runtime panic into a contract-checked path.
Note that the `if` guard uses a brace-delimited block — Ultraviolet has no
brace-less `if` form.

```ultraviolet
public procedure clampedQuotient(numerator: i32, divisor: i32) -> i32 {
    // IntDivisionByZero is a RuntimeCheck that panics. We avoid the panic
    // condition structurally rather than relying on the runtime check.
    if divisor == 0 {
        return 0
    }

    let quotient: i32 = numerator / divisor
    return quotient
}

public procedure firstChannel(pixel: [u8; 4]) -> u8 {
    // ArrayBounds is a StaticCheck: index 0 against length 4 is verified at
    // compile time, so an out-of-range constant index would be ill-formed,
    // never a runtime panic.
    let channel: u8 = pixel[0]
    return channel
}
```

The point is not the arithmetic; it is that each potential fault has been moved to
the strongest available behavior category — ill-formed where possible, otherwise a
guarded, defined path — and none of the code can reach `OutsideConformance`.

### 2.3 Document Conventions and Notation (§1.3)

#### 2.3.1 Normative keywords

The specification's requirement levels use RFC 2119 keywords:

```text
NormativeKeywords.
NormativeKeywords = {`MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, `MAY`}

RFC 2119 Interpretation.
The keywords in NormativeKeywords MUST be interpreted as described in RFC 2119.
```

When the specification (or this handbook quoting it) says **MUST**, it is an
absolute requirement; **MUST NOT** an absolute prohibition; **SHOULD** /
**SHOULD NOT** a strong recommendation with deliberate exceptions; **MAY** a genuine
option. Treat **MUST** rules as compile-or-die constraints on your code.

#### 2.3.2 Diagnostic code format

Every code-owned diagnostic has a structured code:

```text
DiagnosticCodeFormat.
DiagPrefix = {E, W, I, P}
DiagCategory = [A-Z]^3
DiagDigits = [0-9]^4
DiagCode = DiagPrefix ++ "-" ++ DiagCategory ++ "-" ++ DiagDigits
Bucket(Digits) = Digits[0..1]
Seq(Digits) = Digits[2..3]
```

A diagnostic code is a prefix letter, a hyphen, a three-letter category, a hyphen,
and four digits — for example `E-TYP-1810`. The prefix is one of `E` (error),
`W` (warning), `I` (info), `P` (panic). The first two digits are the bucket; the
last two the sequence within it. When you read a compiler message, the `E-` prefix
tells you immediately the program is ill-formed and will not produce an artifact; a
`P-` code corresponds to a runtime panic.

The full diagnostic vocabulary and how a diagnostic renders are fixed in §2 of the
specification ("Diagnostic Infrastructure"). The severity set is broader than the
code prefixes — it adds `Note` for auxiliary diagnostics:

```text
Severity = {Error, Warning, Info, Panic, Note}
```

A diagnostic record is `Diagnostic = ⟨code, severity, message, span⟩` where the code
is optional (`DiagCodeOpt = DiagCode ∪ {⊥}`); auxiliary diagnostics carry `code = ⊥`.
Rendering maps each severity to a lowercase word (`"error"`, `"warning"`, `"info"`,
`"panic"`, `"note"`) followed by the code and an optional `@file:line:col` location.
The full diagnostic infrastructure is the subject of the "Diagnostics & Tooling"
chapter; here it is enough to know the code shape and that
`CompileStatus(Δ) = fail` whenever the diagnostic stream `Δ` contains any error.

#### 2.3.3 Notation used throughout the handbook

The specification is written in operational-semantics notation; this handbook
reproduces the load-bearing rules verbatim. The recurring symbols:

- `Γ ⊢ j` — judgment `j` holds under environment `Γ`.
- `⇓` — evaluates/derives to (e.g. `Γ ⊢ e ⇓ v`).
- `⇑` — emits a diagnostic (raises) for the judgment.
- `⊥` — the undefined marker (an absent or undefined premise/result).
- `⇔` — definitional biconditional; `∧`, `∨`, `¬`, `∀`, `∃` — standard logic.
- A rule `premises / conclusion` is written with the premises above a bar and the
  conclusion below it, optionally labeled `(RuleName)`.

You never write this notation in Ultraviolet source; it is the metalanguage that
*defines* what your source means.

### 2.4 Normative References (§1.4)

The specification builds on four external standards. A conforming implementation
MUST implement the referenced features as described, and **where this specification
differs from a referenced standard, this specification takes precedence.** The
reference table, reproduced from §1.4:

```text
| Reference | Document                                                           | Usage                                                                                     |
| --------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [RFC2119] | RFC 2119: Key words for use in RFCs to Indicate Requirement Levels | Normative keyword interpretation (§1.3)                                                   |
| [UNICODE] | The Unicode Standard, Version 15.0.0                               | Source text encoding (§4.1), identifier normalization (§4.1.6), escape sequences (§4.2.6) |
| [IEEE754] | IEEE 754-2019: Standard for Floating-Point Arithmetic              | Float literal semantics (§16.1), float type representation (§24.2.1)                      |
| [LLVM21]  | LLVM Language Reference Manual, Version 21                         | Backend target and IR requirements (§24.1, §24.7)                                         |
```

What each pins down for code you write:

- **[UNICODE] 15.0.0** governs source text. Identifiers are built from Unicode
  `XID_Start` / `XID_Continue` (plus `_`), and string/char escapes (`\u{...}`,
  `\x..`) are Unicode scalars. Source text is Unicode (the lexical grammar is owned
  by the "Lexical Structure" chapter).
- **[IEEE754] 2019** fixes float literal and float type semantics — `f16`, `f32`,
  `f64` behave per IEEE 754. Do not assume exact-decimal behavior; assume IEEE
  rounding.
- **[LLVM21]** fixes the backend. The target triples and IR requirements come from
  LLVM 21 (relevant to §2.6 below and to the FFI chapter).
- **[RFC2119]** fixes the meaning of the normative keywords (§2.3.1).

### 2.5 Compile-Time Execution and Phase Ordering (§1.5)

#### 2.5.1 The four phases

The translation model is four ordered phases:

```text
TranslationPhases = [Phase1, Phase2, Phase3, Phase4]
Phase1 = ParseAndAggregate
Phase2 = ExecuteComptime
Phase3 = ResolveAndTypecheck
Phase4 = LowerAndEmit
```

with compile-time execution defined as a single pass over the module set:

```text
Γ ⊢ ExecuteComptime(P, Ms) ⇓ Ms_ct ⇔ Γ ⊢ ComptimePass(P, Ms) ⇓ Ms_ct
```

| Phase  | Name               | What happens                                                                                  | Runs at     |
| ------ | ------------------ | --------------------------------------------------------------------------------------------- | ----------- |
| Phase 1 | `ParseAndAggregate`  | Parse every module, aggregate the project's module set `Ms`.                                  | compile time |
| Phase 2 | `ExecuteComptime`    | Execute all `comptime` forms over `Ms`, producing the expanded set `Ms_ct`.                    | compile time |
| Phase 3 | `ResolveAndTypecheck`| Resolve names, type-check declarations, check the entry point, over `Ms_ct` → `Ms_res`.        | compile time |
| Phase 4 | `LowerAndEmit`       | Lower the accepted program and emit objects, IR, and the artifact.                            | compile time |

All four phases run **at compile time**. Run time is the execution of the emitted
artifact; nothing in the four phases is run-time. The distinction "compile time vs
run time" inside Ultraviolet is therefore the line between **Phase 2 `comptime`
execution** (which runs during compilation) and **ordinary procedure bodies** (which
run in the emitted program).

#### 2.5.2 The five ordering requirements

The specification states five **MUST** ordering rules, verbatim:

```text
1. Phase 1 MUST parse and aggregate all modules before Phase 2 begins.
2. Phase 2 MUST execute all compile-time forms over the Phase 1 module set in the deterministic module order defined by §22.1.5.
3. Any declaration emitted during Phase 2 MUST be incorporated into the module set before Phase 3 begins.
4. Phase 3 MUST resolve names and discharge static semantics against the Phase 2-expanded module set.
5. Phase 4 MUST lower and emit only the program accepted by Phase 3.
```

The consequences for how you write code:

- **Compile-time code sees only Phase 1.** A `comptime` form executes over the
  parsed module set, in the deterministic module order of §22.1.5. It cannot observe
  declarations that a *later* module's `comptime` form will emit out of order.
- **Emitted declarations are real by Phase 3.** Anything a `comptime` form produces
  (rule 3) is folded into the module set, so name resolution and type checking in
  Phase 3 see generated and hand-written declarations uniformly. Generated code is
  type-checked exactly like source code.
- **Only accepted programs are emitted (rule 5).** If Phase 3 rejects the program,
  Phase 4 never runs — consistent with `Reject-IllFormed`. There is no partial
  artifact.

The grammar and semantics of the compile-time forms themselves live in the
"Compile-Time Execution & Metaprogramming" chapter (Chapter 22 of the specification);
this section only fixes *when* they run relative to everything else.

#### 2.5.3 Compile-time forms (syntax)

For grounding, the compile-time forms whose execution constitutes Phase 2 are
introduced by the `comptime` keyword. Their grammar (specification §22.1.1 and
Appendix B, verbatim):

```ebnf
comptime_stmt           ::= attribute_list? "comptime" block_expr
comptime_expr           ::= attribute_list? "comptime" "{" expression "}"
comptime_if             ::= "comptime" "if" expression block_expr ("else" (comptime_if | block_expr))?
comptime_loop           ::= "comptime" "loop" pattern (":" type)? "in" expression block_expr
comptime_procedure_decl ::= attribute_list? "comptime" visibility? "procedure" identifier generic_params? signature contract_clause? block_expr
type_literal            ::= "Type" "::" "<" type ">"
```

`comptime` is a reserved word (it appears in the language's `Reserved` set), so it is
never available as an identifier. A `comptime` block runs in Phase 2; an ordinary
procedure body runs at run time.

#### 2.5.4 Worked example: compile-time versus run-time evaluation

The example below shows the phase split. The `comptime` block runs in Phase 2 during
compilation and fixes a constant; the rest of `main` runs at run time in the emitted
artifact. Both are type-checked together in Phase 3. (The `main` signature takes the
required `Context` bundle parameter and returns `i32`, per §2.1.4.)

```ultraviolet
public procedure main(ctx: Context) -> i32 {
    comptime {
        // Phase 2: executed during compilation, before this procedure is
        // lowered. Compile-time-only work belongs in a comptime form.
        let table_size: usize = 1 << 8
    }

    // Run time: executed when the emitted program runs.
    let exit_code: i32 = 0
    return exit_code
}
```

The boundary is exact: code inside `comptime { ... }` participates in Phase 2 over
the Phase 1 module set; code outside it is lowered in Phase 4 and executed at run
time. Phase ordering rule 4 guarantees that by the time `main` is type-checked, any
declarations a `comptime` form emitted are already present.

### 2.6 Target and ABI Assumptions (§1.6)

#### 2.6.1 Target profiles

A compilation targets exactly one profile from a fixed set:

```text
TargetProfile = {`x86_64-sysv`, `x86_64-win64`, `aarch64-aapcs64`, `aarch64-darwin`}
SelectedTargetProfile ∈ TargetProfile
```

The selected profile is resolved once per compilation invocation, by a fixed
precedence (reproduced verbatim from §1.6):

```text
The selected target profile is resolved once per compilation invocation.
Resolution order is:
1. the explicit CLI target-profile override, if provided;
2. otherwise `toolchain.target_profile` from `Ultraviolet.toml`, if provided;
3. otherwise the compilation invocation is ill-formed.
A conforming implementation MUST NOT silently infer `SelectedTargetProfile` from the host platform.
```

This is a deliberate departure from compilers that default to the host. **If neither
the CLI nor `Ultraviolet.toml` specifies a profile, the invocation is ill-formed** —
there is no implicit host default. When you set up a project, the
`toolchain.target_profile` key in `Ultraviolet.toml` is therefore effectively
mandatory unless every invocation passes the CLI override. (The `Ultraviolet.toml`
manifest is detailed in the "Projects, Modules & the Build Model" chapter.)

#### 2.6.2 Architecture, endianness, and pointer size

Each profile maps to an architecture, and the memory model is fixed across all
profiles:

```text
TargetArch(`x86_64-sysv`) = `x86_64`
TargetArch(`x86_64-win64`) = `x86_64`
TargetArch(`aarch64-aapcs64`) = `aarch64`
TargetArch(`aarch64-darwin`) = `aarch64`

Endianness = Little
PtrSizeBytes = PtrSize
```

All four profiles are **little-endian**, and pointer size is `PtrSize` (the
pointer-width determines `isize`/`usize` — see the "Primitive Types & Literals"
chapter). Because endianness is fixed, layout and `bytes` semantics are uniform
across targets; you do not write byte-order conditionals to be portable across the
supported profiles.

#### 2.6.3 LLVM target triples

Each profile resolves to an LLVM 21 target triple:

```text
Target(`x86_64-sysv`) = "x86_64-unknown-linux-gnu"
Target(`x86_64-win64`) = "x86_64-pc-windows-msvc"
Target(`aarch64-aapcs64`) = "aarch64-unknown-linux-gnu"
Target(`aarch64-darwin`) = "arm64-apple-macosx14.0.0"
```

These triples are what the backend (Phase 4) emits against, per the [LLVM21]
normative reference. They matter directly for FFI: the C ABI your foreign functions
must match is the one named by the selected triple (System V on `x86_64-sysv`,
Win64 on `x86_64-win64`, AAPCS64 on the aarch64 profiles). The "FFI, `unsafe` &
Foreign Boundaries" chapter builds on exactly these.

#### 2.6.4 Where ABI and layout are actually defined

§1.6 closes with a scoping rule that prevents you from over-reading it:

```text
Layout and ABI requirements are defined only by their canonical owner sections in this document, especially Chapters 12, 13, 14.6, and 23.2. `LayoutSpec` is not a normative relation of this specification.
```

So §1.6 fixes only the *target selection* and the *cross-target invariants*
(little-endian, pointer size, triples). Concrete struct layout, calling conventions,
and ABI lowering are owned by the type-layout and codegen chapters. Do not infer
layout rules from this chapter; consult the canonical owner sections (covered in the
"Memory Layout & Representation" and "Codegen & the LLVM Backend" chapters).

### 2.7 Idioms & Best Practices

- **Push every machine-checkable rule into the strongest behavior category.** The
  ranking is: ill-formed (compile error) > guarded/contract-checked defined path >
  runtime panic > `OutsideConformance`. The style guide states it directly: "If a
  rule about safety, range, state, ownership, lifetime, authority, or valid
  sequencing can be expressed with contracts or invariants, express it in code." Use
  the type system, `modal` types, contracts, and invariants before runtime checks.
- **Prefer static checks over runtime checks where the operand is known.** Because
  `ArrayBounds` and `SafePointerValidity` are `StaticCheck`s, structuring code so
  indices and pointer states are statically known turns potential panics into
  compile errors.
- **Treat panics as defined failures, not catchable corruption.** The five
  `RuntimeCheck`s all panic (`RuntimeBehavior(...) = Panic`). Defensive code prevents
  the panic *condition*; it does not try to recover a corrupted value, because there
  is none.
- **Keep `OutsideConformance` unreachable in safe code.** It arises only from
  resource exhaustion or explicit unsafe boundaries (e.g. region reset/free
  misuse). Keep `unsafe` small, local, and wrapped in safe APIs that re-establish
  invariants, per the style guide.
- **Give an executable a conforming `main`.** It must be `public`, take exactly one
  `Context` bundle parameter, and return `i32`; anything else fails `MainCheck`.
  Non-executable assemblies (`library`, `dependency`) need no `main`.
- **Set `toolchain.target_profile` explicitly.** There is no host default; an
  unspecified profile is ill-formed. Pin it in `Ultraviolet.toml` so builds are
  reproducible across machines.
- **Put compile-time-only work in `comptime` forms, run-time work in ordinary
  bodies.** The phase model guarantees `comptime` runs in Phase 2 over the Phase 1
  module set; rely on that ordering rather than on cross-module emission you cannot
  observe.
- **Read diagnostic codes by prefix.** `E-` means ill-formed (no artifact); `P-`
  means a runtime panic; `W-`/`I-` are advisory. The prefix tells you immediately
  whether the build can succeed.
- **Honor the normative keywords.** Where the specification says **MUST** /
  **MUST NOT**, write code that obeys it unconditionally; **SHOULD** is a strong
  default, **MAY** a genuine option.

### 2.8 Pitfalls & Diagnostics

- **Writing a brace-less `if`.** Ultraviolet's `if` requires a block:
  `if_tail ::= block_expr ...`. There is no statement-only `if x  return y` form;
  write `if x { return y }`. A brace-less `if` is a parse error, not a style nit.
- **Giving an executable the wrong `main`.** A zero-parameter `main`, a `main`
  returning something other than `i32`, a non-`public` `main`, a generic `main`, or
  two `main`s all fail `MainCheck` (`Main-Signature-Err`, `Main-Generic-Err`,
  `Main-Multiple`, `Main-Missing`) and reject the project. The one required
  parameter is a `Context` bundle.
- **Assuming an out-of-bounds or overflow "just wraps."** It does not — it panics
  (`RuntimeBehavior(SliceBounds) = Panic`, `RuntimeBehavior(IntegerOverflow) =
  Panic`, etc.). A `P-` diagnostic at run time is a crash, not a quietly wrong value.
- **Assuming a freed-region pointer use is merely "a bug."** It is
  `OutsideConformance` — the specification imposes *no* requirement on what happens,
  including termination. This is qualitatively worse than a panic and must be
  designed out entirely, not handled.
- **Expecting partial output from a failing build.** A non-conforming project is
  rejected (`Reject-IllFormed`) and Phase 4 never runs (ordering rule 5). There is no
  best-effort artifact when Phase 3 reports an `E-` error.
- **Letting the target profile default to the host.** An invocation with no CLI
  override and no `toolchain.target_profile` is ill-formed; a conforming compiler
  MUST NOT infer the profile from the host. The symptom is a rejected invocation, not
  a silently chosen target.
- **Depending on implementation-defined strategy.** Where the specification says
  "implementation-defined" (e.g. a resolution strategy MAY be lazy), do not write
  code whose correctness depends on a particular permitted choice; correct programs
  work under all of them.
- **Confusing ill-formed with statically-undefined.** `IllFormed` means a rule
  applies but its premises fail; `StaticUndefined` means a rule's premise is `⊥`
  (no defined static meaning). Both surface at compile time and both stop the build,
  but the latter emits via `Static-Undefined` / `Static-Undefined-NoCode` and may
  carry no code.
- **Reading byte-order or layout rules into §1.6.** §1.6 fixes target selection,
  little-endianness, pointer size, and triples only. Concrete layout/ABI is owned by
  the layout and codegen chapters; `LayoutSpec` is explicitly *not* a normative
  relation of the specification.
- **Treating compile-time and run-time code as interchangeable.** A `comptime` form
  runs in Phase 2 during compilation and cannot observe out-of-order Phase 2
  emissions from other modules; ordinary bodies run only in the emitted artifact.
  Mixing the two expectations leads to "why can't my comptime code see that
  declaration" confusion that the §22.1.5 module order explains.

<nav class="spec-reader-map" aria-label="Handbook chapter navigation">
<a href="/docs/handbook/01-introduction/">Previous: 1. Introduction &amp; Design Philosophy</a>
<a href="/docs/handbook/03-project-model/">Next: 3. Projects, Manifest, Modules &amp; the Compilation Model</a>
</nav>
