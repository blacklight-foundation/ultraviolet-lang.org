---
title: "Abstract Machine, Objects, Responsibility, and Authority"
description: "6. Abstract Machine, Objects, Responsibility, and Authority of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T17:39:45.389Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 6. Abstract Machine, Objects, Responsibility, and Authority

### 6.1 Authority Model

The language adopts a no ambient authority discipline: observable external effects are possible only through explicit possession and use of capability values.

#### 6.1.1 Capability Universe

CapToken = {FileSystem, Network, HeapAllocator, Reactor, ExecutionDomain, System}

```text
CapInType : Type → 𝒫(CapToken)
```

CapInType(TypePath([`Context`])) = {FileSystem, Network, HeapAllocator, Reactor, ExecutionDomain, System}
CapInType(TypePath([`System`])) = {System}
CapInType(TypeDynamic([`FileSystem`])) = {FileSystem}
CapInType(TypeDynamic([`Network`])) = {Network}
CapInType(TypeDynamic([`HeapAllocator`])) = {HeapAllocator}
CapInType(TypeDynamic([`Reactor`])) = {Reactor}
CapInType(TypeDynamic([`ExecutionDomain`])) = {ExecutionDomain}
CapInType(TypePerm(_, T)) = CapInType(T)

```text
CapInType(TypeTuple(Ts)) = ⋃{CapInType(T) | T ∈ Ts}
```

CapInType(TypeArray(T, _)) = CapInType(T)
CapInType(TypeSlice(T)) = CapInType(T)

<!-- Source: "CapInType(TypeStruct(_), TypeRecord(_), TypeUnion(_), TypeEnum(_), TypeModalState(_), TypeApply(_), …) distributes structurally over the immediate component types of the type constructor (after alias expansion)." -->
CapInType(T) distributes structurally over compound nominal, modal, union, and applied types after alias expansion.

Implementations MAY compute `CapInType` by least fixed-point over nominal and alias expansion. Cycles MUST terminate by memoization or an equivalent visited-node strategy.

#### 6.1.2 No Ambient Authority Requirements

**(NAA-1) No implicit capability roots.** A conforming implementation MUST NOT provide any implicit or global binding whose type is capability-bearing under `CapInType`.

**(NAA-2) Context as the sole explicit root carrier.** The only capability roots introduced by the abstract machine at runtime are those contained in `Context` values produced by `ContextInitSigma` in §24.4.5 or by `HostSessionInitSigma` in §24.4.4. A conforming implementation MUST introduce those roots only through the executable entry procedure or a hosted-library session created by the sanctioned hosted-library lifecycle.

**(NAA-3) Effect gating.** Any externally observable effect specified by this document MUST occur only as a consequence of calling:
- a runtime host primitive classified in §6.2, or
- a built-in procedure or method whose receiver is a capability value.

CapReq(d) = ⋃{CapInType(T_i) | T_i is the type of a parameter or receiver of declaration d}

```text
For every direct call from `d_src` to `d_tgt`, a conforming implementation MUST reject the program unless `CapReq(d_tgt) ⊆ CapReq(d_src)`.
```

#### 6.1.3 Attenuation Requirements

The following operations are attenuation operations:
- `$FileSystem::restrict(root)`
- `$Network::restrict_to_host(host)`
- `$HeapAllocator::with_quota(bytes)`
- `CancelToken@Active::child()`
- `Context::cpu()`
- `Context::gpu()`
- `Context::inline()`

A conforming implementation MUST ensure attenuation is monotone: a derived capability MUST NOT grant authority beyond the source capability from which it was derived.

For every attenuation operation `ChildCap = ParentCap~>attenuate(...)`, a conforming implementation MUST enforce all of the following:
- `ChildCap` remains operational only while `ParentCap` remains live.
- Dropping `ChildCap` MUST NOT invalidate or diminish `ParentCap`.
- Dropping `ParentCap` while any derived child capability remains live is ill-formed.
- Any runtime delegation performed by `ChildCap` MUST be routed through `ParentCap` or through an equivalent runtime object that enforces an equal-or-stricter authority subset.

#### 6.1.4 Observable Behavior and As-If Rule

```text
ObservableEffect ∈ {
```

  HostEffect(proc, args),
  FfiEffect(proc, abi, dir),
  PanicEffect(kind),
  DropEffect(target),
  KeyEffect(kind, paths)
}

An event is observable iff it is:
- a runtime host-primitive action from `HostPrimRuntime`;
- transfer across an FFI boundary;
- panic initiation, panic-to-abort escalation, or a caught-unwind boundary result;
- invocation of drop cleanup for a responsible value or static;
- key acquisition, key release, or ordered key-block commit.

The observable behavior of an execution is the ordered trace of its observable events together with its final outcome in `{normal, panic, abort}`.

A conforming implementation MAY apply any transformation whose executions preserve all of the following:
- the same observable-event trace at every sequence point;
- the same relative order of drop actions required by `CleanupScope`, `Unwind`, and `Destroy`;
- the same relative order of capability-mediated host effects and FFI-boundary effects induced by the source semantics;
- the same panic, non-panic, and abort outcomes, including the same `[[unwind]]` boundary behavior;
- the same key-acquisition, key-release, and ordered-commit behavior required by Chapter `19`;
- the same permission, provenance, and responsibility facts required by Chapters `6`, `10`, `18`, `23`, and `24`.

In particular, a conforming implementation MUST NOT:
- eliminate, duplicate, or reorder observable events;
- suppress or invent any `Drop` action required by the cleanup rules;
- reorder host effects or FFI-boundary effects across sequence points;
- transform a panicking execution into a non-panicking execution, or the reverse;
- introduce behavior that violates the key system, provenance rules, or no-ambient-authority rules.

#### 6.1.5 Sequence Points

A sequence point is a program point at which:
- all observable effects sequenced before that point are complete;
- no observable effect sequenced after that point has begun; and
- binding-state, provenance, and key-holding state are determined by the rules of the owning chapters.

The canonical sequence points are:
- after each terminated statement;
- after receiver and argument evaluation and before control enters the callee of a call or method call;
- after the left operand of `&&` and `||` and before any right-operand evaluation that follows;
- after the condition of `if` and before the selected branch;
- after the scrutinee of `if ... is` and before pattern selection or selected-body evaluation;
- after key-path evaluation and before a key block acquires or commits keys;
- immediately before scope cleanup begins on ordinary scope exit, `return`, `break`, `continue`, panic unwinding, and FFI-boundary unwinding.

`Children_LTR` in §24.7.7 defines left-to-right subexpression order inside a segment between adjacent sequence points. A conforming implementation MUST preserve that order unless an equivalent transformation preserves the same observable behavior and the same sequence-point boundaries.

#### 6.1.6 Unsafe and Foreign Interaction

The no-ambient-authority requirements constrain the safe execution model. `unsafe` operations and the foreign-function interface MAY escape these constraints by design, but capability isolation still applies. See §23.5.

### 6.2 Host Primitives

FSPrim = {FSOpenRead, FSOpenWrite, FSOpenAppend, FSCreateWrite, FSReadFile, FSReadBytes, FSWriteFile, FSWriteStdout, FSWriteStderr, FSExists, FSRemove, FSOpenDir, FSCreateDir, FSEnsureDir, FSKind, FSRestrict}
FilePrim = {FileReadAll, FileReadAllBytes, FileWrite, FileFlush, FileClose}
DirPrim = {DirNext, DirClose}
SystemPrim = {SystemGetEnv, SystemExit, SystemRun}
NetworkPrim = {NetRestrictHost}
HeapPrim = {HeapWithQuota, HeapAllocRaw, HeapDeallocRaw}
ReactorPrim = {ReactorRun, ReactorRegister}
CancelPrim = {CancelNew, CancelChild, CancelDoCancel, CancelIsCancelled, CancelWaitCancelled}

```text
HostPrim = {ParseTOML, ReadBytes, WriteFile, ResolveTool, ResolveRuntimeLib, Invoke, AssembleIR, InvokeLinker, InvokeArchiver, ArchiveMembers} ∪ FSPrim ∪ FilePrim ∪ DirPrim ∪ SystemPrim ∪ NetworkPrim ∪ HeapPrim ∪ ReactorPrim ∪ CancelPrim
```

HostPrimDiag = {ParseTOML, ReadBytes, WriteFile, ResolveTool, ResolveRuntimeLib, Invoke, AssembleIR, InvokeLinker, InvokeArchiver, ArchiveMembers}

```text
HostPrimRuntime = FSPrim ∪ FilePrim ∪ DirPrim ∪ SystemPrim ∪ NetworkPrim ∪ HeapPrim ∪ ReactorPrim ∪ CancelPrim
```

```text
MapsToDiagOrRuntime(p) ⇔ p ∈ HostPrimDiag ∪ HostPrimRuntime
HostPrimFail(p) ⇔ p ∈ HostPrim ∧ ∃ args. Γ ⊢ p(args) ⇑
```

```text
HostPrimFail(p) ∧ ¬ MapsToDiagOrRuntime(p) ⇒ IllFormed(p)
```

#### 6.2.1 FileSystem, File, and Directory Primitive Relations

Feature-local runtime behavior for capability-bearing filesystem operations is owned here. The built-in capability and modal declarations in Chapters 13 and 14 define the type surface; this section defines the runtime relations they invoke.

```text
FSJudg = {FSOpenRead(fs, path) ⇓ r, FSOpenWrite(fs, path) ⇓ r, FSOpenAppend(fs, path) ⇓ r, FSCreateWrite(fs, path) ⇓ r, FSReadFile(fs, path) ⇓ r, FSReadBytes(fs, path) ⇓ r, FSWriteFile(fs, path, data) ⇓ r, FSWriteStdout(fs, data) ⇓ r, FSWriteStderr(fs, data) ⇓ r, FSExists(fs, path) ⇓ b, FSRemove(fs, path) ⇓ r, FSOpenDir(fs, path) ⇓ r, FSCreateDir(fs, path) ⇓ r, FSEnsureDir(fs, path) ⇓ r, FSKind(fs, path) ⇓ r, FSRestrict(fs, path) ⇓ fs', FileReadAll(handle) ⇓ r, FileReadAllBytes(handle) ⇓ r, FileWrite(handle, data) ⇓ r, FileFlush(handle) ⇓ r, FileClose(handle) ⇓ ok, DirNext(handle) ⇓ r, DirClose(handle) ⇓ ok}
```

FSResType(FSOpenRead) = `Outcome<File@Read, IoError>`
FSResType(FSOpenWrite) = `Outcome<File@Write, IoError>`
FSResType(FSOpenAppend) = `Outcome<File@Append, IoError>`
FSResType(FSCreateWrite) = `Outcome<File@Write, IoError>`
FSResType(FSReadFile) = `Outcome<unique string@Managed, IoError>`
FSResType(FSReadBytes) = `Outcome<unique bytes@Managed, IoError>`
FSResType(FSWriteFile) = `Outcome<(), IoError>`
FSResType(FSWriteStdout) = `Outcome<(), IoError>`
FSResType(FSWriteStderr) = `Outcome<(), IoError>`
FSResType(FSExists) = `bool`
FSResType(FSRemove) = `Outcome<(), IoError>`
FSResType(FSOpenDir) = `Outcome<DirIter@Open, IoError>`
FSResType(FSCreateDir) = `Outcome<(), IoError>`
FSResType(FSEnsureDir) = `Outcome<(), IoError>`
FSResType(FSKind) = `Outcome<FileKind, IoError>`
FSResType(FSRestrict) = `$FileSystem`
FSResType(FileReadAll) = `Outcome<unique string@Managed, IoError>`
FSResType(FileReadAllBytes) = `Outcome<unique bytes@Managed, IoError>`
FSResType(FileWrite) = `Outcome<(), IoError>`
FSResType(FileFlush) = `Outcome<(), IoError>`
FSResType(FileClose) = `ok`
FSResType(DirNext) = `Outcome<DirEntry | (), IoError>`
FSResType(DirClose) = `ok`

When `FSResType(Op) = Outcome<T, E>`, a primitive relation in this section that
returns a successful payload `v` denotes `Outcome<T, E>@Value{value: v}`.
A primitive relation that returns an `IoError` value `e` denotes
`Outcome<T, IoError>@Error{error: e}`. For `DirNext`, the successful payload
type is `DirEntry | ()`, so exhausted iteration returns the `()` member inside
`Outcome<DirEntry | (), IoError>@Value`.

Handle = ℕ
Entry ::= FileEntry(bytes) | DirEntry(names) | OtherEntry

```text
FSState = ⟨entries, handles, diriters, flushed, failmap⟩
Entries(⟨entries, handles, diriters, flushed, failmap⟩) = entries
Handles(⟨entries, handles, diriters, flushed, failmap⟩) = handles
DirIters(⟨entries, handles, diriters, flushed, failmap⟩) = diriters
FlushedSet(⟨entries, handles, diriters, flushed, failmap⟩) = flushed
FailMap(⟨entries, handles, diriters, flushed, failmap⟩) = failmap
```

EntryKind(ω, path) =
 `File`  if Entries(ω)[path] = FileEntry(_)
 `Dir`   if Entries(ω)[path] = DirEntry(_)
 `Other` if Entries(ω)[path] = OtherEntry
 `Other` otherwise

```text
FileBytes(ω, path) = bytes ⇔ Entries(ω)[path] = FileEntry(bytes)
DirNames(ω, path) = names ⇔ Entries(ω)[path] = DirEntry(names)
```

HandleStateOf(ω, h) =
 Handles(ω)[h].state  if Handles(ω)[h] defined
 `Closed`             otherwise
HandlePos(ω, h) =
 Handles(ω)[h].pos  if Handles(ω)[h] defined
 0                  otherwise
HandleLen(ω, h) =
 Handles(ω)[h].len  if Handles(ω)[h] defined
 0                  otherwise
HandlePath(ω, h) =
 Handles(ω)[h].path  if Handles(ω)[h] defined
 "\""                otherwise
DirIterFS(ω, h) =
 DirIters(ω)[h].fs  if DirIters(ω)[h] defined

```text
 ⊥                  otherwise
```

DirIterPath(ω, h) =
 DirIters(ω)[h].path  if DirIters(ω)[h] defined
 "\""                 otherwise
DirIterEntries(ω, h) =
 DirIters(ω)[h].entries  if DirIters(ω)[h] defined
 []                      otherwise
DirIterPos(ω, h) =
 DirIters(ω)[h].pos  if DirIters(ω)[h] defined
 0                    otherwise

```text
DirIterOpen(ω, h) ⇔ DirIters(ω)[h] defined
Flushed(ω, h) ⇔ h ∈ FlushedSet(ω)
FSJudg_ω = {FSOpenRead(fs, path, ω) ⇓ (r, ω'), FSOpenWrite(fs, path, ω) ⇓ (r, ω'), FSOpenAppend(fs, path, ω) ⇓ (r, ω'), FSCreateWrite(fs, path, ω) ⇓ (r, ω'), FSReadFile(fs, path, ω) ⇓ (r, ω'), FSReadBytes(fs, path, ω) ⇓ (r, ω'), FSWriteFile(fs, path, data, ω) ⇓ (r, ω'), FSWriteStdout(fs, data, ω) ⇓ (r, ω'), FSWriteStderr(fs, data, ω) ⇓ (r, ω'), FSExists(fs, path, ω) ⇓ (b, ω'), FSRemove(fs, path, ω) ⇓ (r, ω'), FSOpenDir(fs, path, ω) ⇓ (r, ω'), FSCreateDir(fs, path, ω) ⇓ (r, ω'), FSEnsureDir(fs, path, ω) ⇓ (r, ω'), FSKind(fs, path, ω) ⇓ (r, ω')}
FileJudg_ω = {FileReadAll(h, ω) ⇓ (r, ω'), FileReadAllBytes(h, ω) ⇓ (r, ω'), FileWrite(h, data, ω) ⇓ (r, ω'), FileFlush(h, ω) ⇓ (r, ω'), FileClose(h, ω) ⇓ (ok, ω')}
DirJudg_ω = {DirNext(h, ω) ⇓ (r, ω'), DirClose(h, ω) ⇓ (ok, ω')}
```

```text
FSOpenRead(fs, path) ⇓ r ⇔ ∃ ω, ω'. FSOpenRead(fs, path, ω) ⇓ (r, ω')
FSOpenWrite(fs, path) ⇓ r ⇔ ∃ ω, ω'. FSOpenWrite(fs, path, ω) ⇓ (r, ω')
FSOpenAppend(fs, path) ⇓ r ⇔ ∃ ω, ω'. FSOpenAppend(fs, path, ω) ⇓ (r, ω')
FSCreateWrite(fs, path) ⇓ r ⇔ ∃ ω, ω'. FSCreateWrite(fs, path, ω) ⇓ (r, ω')
FSReadFile(fs, path) ⇓ r ⇔ ∃ ω, ω'. FSReadFile(fs, path, ω) ⇓ (r, ω')
FSReadBytes(fs, path) ⇓ r ⇔ ∃ ω, ω'. FSReadBytes(fs, path, ω) ⇓ (r, ω')
FSWriteFile(fs, path, data) ⇓ r ⇔ ∃ ω, ω'. FSWriteFile(fs, path, data, ω) ⇓ (r, ω')
FSWriteStdout(fs, data) ⇓ r ⇔ ∃ ω, ω'. FSWriteStdout(fs, data, ω) ⇓ (r, ω')
FSWriteStderr(fs, data) ⇓ r ⇔ ∃ ω, ω'. FSWriteStderr(fs, data, ω) ⇓ (r, ω')
FSExists(fs, path) ⇓ b ⇔ ∃ ω, ω'. FSExists(fs, path, ω) ⇓ (b, ω')
FSRemove(fs, path) ⇓ r ⇔ ∃ ω, ω'. FSRemove(fs, path, ω) ⇓ (r, ω')
FSOpenDir(fs, path) ⇓ r ⇔ ∃ ω, ω'. FSOpenDir(fs, path, ω) ⇓ (r, ω')
FSCreateDir(fs, path) ⇓ r ⇔ ∃ ω, ω'. FSCreateDir(fs, path, ω) ⇓ (r, ω')
FSEnsureDir(fs, path) ⇓ r ⇔ ∃ ω, ω'. FSEnsureDir(fs, path, ω) ⇓ (r, ω')
FSKind(fs, path) ⇓ r ⇔ ∃ ω, ω'. FSKind(fs, path, ω) ⇓ (r, ω')
FileReadAll(h) ⇓ r ⇔ ∃ ω, ω'. FileReadAll(h, ω) ⇓ (r, ω')
FileReadAllBytes(h) ⇓ r ⇔ ∃ ω, ω'. FileReadAllBytes(h, ω) ⇓ (r, ω')
FileWrite(h, data) ⇓ r ⇔ ∃ ω, ω'. FileWrite(h, data, ω) ⇓ (r, ω')
FileFlush(h) ⇓ r ⇔ ∃ ω, ω'. FileFlush(h, ω) ⇓ (r, ω')
FileClose(h) ⇓ ok ⇔ ∃ ω, ω'. FileClose(h, ω) ⇓ (ok, ω')
DirNext(h) ⇓ r ⇔ ∃ ω, ω'. DirNext(h, ω) ⇓ (r, ω')
DirClose(h) ⇓ ok ⇔ ∃ ω, ω'. DirClose(h, ω) ⇓ (ok, ω')
```

```text
RestrictPath(base, path) = p ⇔ ¬ AbsPath(path) ∧ b = Canon(Normalize(base)) ∧ b ≠ ⊥ ∧ p = Canon(Normalize(Join(b, path))) ∧ p ≠ ⊥ ∧ prefix(p, b)
RestrictPath(base, path) = ⊥ ⇔ AbsPath(path) ∨ Canon(Normalize(base)) = ⊥ ∨ Canon(Normalize(Join(Canon(Normalize(base)), path))) = ⊥ ∨ ¬ prefix(Canon(Normalize(Join(Canon(Normalize(base)), path))), Canon(Normalize(base)))
```

FSOp = {FSOpenRead, FSOpenWrite, FSOpenAppend, FSCreateWrite, FSReadFile, FSReadBytes, FSWriteFile, FSWriteStdout, FSWriteStderr, FSExists, FSRemove, FSOpenDir, FSCreateDir, FSEnsureDir, FSKind}

```text
FSRestrict(fs, base) ⇓ fs' ∧ Op ∈ FSOp ∧ RestrictPath(base, p) = q ⇒ Op(fs', p) = Op(fs, q)
FSRestrict(fs, base) ⇓ fs' ∧ Op ∈ FSOp ∧ RestrictPath(base, p) = ⊥ ∧ Op ≠ FSExists ⇒ Op(fs', p) = IoError::InvalidPath
FSRestrict(fs, base) ⇓ fs' ∧ RestrictPath(base, p) = ⊥ ⇒ FSExists(fs', p) = false
```

FSPathOp_0 = {FSOpenRead, FSOpenWrite, FSOpenAppend, FSCreateWrite, FSReadFile, FSReadBytes, FSRemove, FSOpenDir, FSCreateDir, FSEnsureDir, FSKind}
FSPathOp_1 = {FSWriteFile}
FSRequiresExisting = {FSOpenRead, FSOpenWrite, FSOpenAppend, FSReadFile, FSReadBytes, FSOpenDir, FSKind, FSRemove}

```text
PathInvalid(fs, path, ω) ⇔ Canon(Normalize(path)) = ⊥
EntryExists(ω, path) ⇔ Entries(ω)[path] defined
PermissionDenied(fs, path, Op, ω) ⇔ FailMap(ω)[⟨Op, path⟩] = IoError::PermissionDenied
Busy(fs, path, Op, ω) ⇔ FailMap(ω)[⟨Op, path⟩] = IoError::Busy
OtherFailure(fs, path, Op, ω) ⇔ FailMap(ω)[⟨Op, path⟩] = IoError::IoFailure
```

```text
Op ∈ FSPathOp_0 ∧ PathInvalid(fs, path, ω) ⇒ Op(fs, path, ω) ⇓ (IoError::InvalidPath, ω)
Op ∈ FSPathOp_1 ∧ PathInvalid(fs, path, ω) ⇒ Op(fs, path, data, ω) ⇓ (IoError::InvalidPath, ω)
Op ∈ FSRequiresExisting ∧ ¬ EntryExists(ω, path) ⇒ Op(fs, path, ω) ⇓ (IoError::NotFound, ω)
PermissionDenied(fs, path, Op, ω) ⇒ Op(fs, path, ω) ⇓ (IoError::PermissionDenied, ω)
Op = FSCreateWrite ∧ EntryExists(ω, path) ⇒ Op(fs, path, ω) ⇓ (IoError::AlreadyExists, ω)
Op ∈ {FSCreateDir, FSEnsureDir} ∧ EntryExists(ω, path) ∧ EntryKind(ω, path) ≠ `Dir` ⇒ Op(fs, path, ω) ⇓ (IoError::AlreadyExists, ω)
Op = FSOpenDir ∧ EntryExists(ω, path) ∧ EntryKind(ω, path) ≠ `Dir` ⇒ Op(fs, path, ω) ⇓ (IoError::InvalidPath, ω)
Busy(fs, path, Op, ω) ⇒ Op(fs, path, ω) ⇓ (IoError::Busy, ω)
OtherFailure(fs, path, Op, ω) ⇒ Op(fs, path, ω) ⇓ (IoError::IoFailure, ω)
```

```text
FSReadFile(fs, path, ω) ⇓ (r, ω') ∧ FSReadBytes(fs, path, ω) ⇓ (bytes, ω'') ∧ ¬ Utf8Valid(bytes) ⇒ r = IoError::IoFailure
FileReadAll(h, ω) ⇓ (r, ω') ∧ FileReadAllBytes(h, ω) ⇓ (bytes, ω'') ∧ ¬ Utf8Valid(bytes) ⇒ r = IoError::IoFailure
```

```text
FSExists(fs, path, ω) ⇓ (true, ω') ⇒ EntryExists(ω, path) ∧ ¬ PathInvalid(fs, path, ω)
FSExists(fs, path, ω) ⇓ (false, ω') ⇒ PathInvalid(fs, path, ω) ∨ ¬ EntryExists(ω, path)
```

HandleState = {`OpenRead`, `OpenWrite`, `OpenAppend`, `Closed`}

```text
HandleOpen(ω, h) ⇔ HandleStateOf(ω, h) ≠ `Closed`
```

HandleMode(ω, h) =
 `Read`    if HandleStateOf(ω, h) = `OpenRead`
 `Write`   if HandleStateOf(ω, h) = `OpenWrite`
 `Append`  if HandleStateOf(ω, h) = `OpenAppend`
FileLenAt(ω, path) =
 ByteLen(bytes)  if Entries(ω)[path] = FileEntry(bytes)
 0               otherwise
ByteLen(data) =
 |data|       if data ∈ Bytes
 |Utf8(data)| if data ∈ String
 0            otherwise

```text
LexBytes(b_1, b_2) ⇔ (∃ k. 0 ≤ k < min(|b_1|, |b_2|) ∧ (∀ i < k. b_1[i] = b_2[i]) ∧ b_1[k] < b_2[k]) ∨ (|b_1| < |b_2| ∧ ∀ i < |b_1|. b_1[i] = b_2[i])
```

EntryKey(name) = CaseFold(NFC(name))

```text
EntryOrder(a, b) ⇔ LexBytes(Utf8(EntryKey(a)), Utf8(EntryKey(b))) ∨ (EntryKey(a) = EntryKey(b) ∧ LexBytes(Utf8(a), Utf8(b)))
```

DirSnapshot(fs, path, ω) =

```text
 [ `DirEntry`{`path`: Join(path, name), `name`: name, `kind`: EntryKind(ω, Join(path, name))} | name ∈ DirNames(ω, path) ∧ name ≠ "." ∧ name ≠ ".." ]  if Entries(ω)[path] = DirEntry(_)
```

 []                                                                                                                        otherwise

```text
DirEntries(fs, path, ω) = sort_{λ a, b. EntryOrder(a.name, b.name)}(DirSnapshot(fs, path, ω))
```

```text
FSOpenRead(fs, path, ω) ⇓ (`File@Read`{`handle`: h}, ω') ⇒ HandleStateOf(ω', h) = `OpenRead` ∧ HandlePos(ω', h) = 0 ∧ HandlePath(ω', h) = path ∧ HandleLen(ω', h) = FileLenAt(ω, path)
FSOpenWrite(fs, path, ω) ⇓ (`File@Write`{`handle`: h}, ω') ⇒ HandleStateOf(ω', h) = `OpenWrite` ∧ HandlePos(ω', h) = 0 ∧ HandlePath(ω', h) = path ∧ HandleLen(ω', h) = FileLenAt(ω, path)
FSOpenAppend(fs, path, ω) ⇓ (`File@Append`{`handle`: h}, ω') ⇒ HandleStateOf(ω', h) = `OpenAppend` ∧ HandlePos(ω', h) = FileLenAt(ω, path) ∧ HandlePath(ω', h) = path ∧ HandleLen(ω', h) = FileLenAt(ω, path)
FSCreateWrite(fs, path, ω) ⇓ (`File@Write`{`handle`: h}, ω') ⇒ HandleStateOf(ω', h) = `OpenWrite` ∧ HandlePos(ω', h) = 0 ∧ HandlePath(ω', h) = path ∧ HandleLen(ω', h) = 0
```

```text
FSReadFile(fs, path, ω) ⇓ (r, ω') ⇔ ∃ h, ω_1, ω_2. FSOpenRead(fs, path, ω) ⇓ (`File@Read`{`handle`: h}, ω_1) ∧ FileReadAll(h, ω_1) ⇓ (r, ω_2) ∧ FileClose(h, ω_2) ⇓ (ok, ω')
FSReadBytes(fs, path, ω) ⇓ (r, ω') ⇔ ∃ h, ω_1, ω_2. FSOpenRead(fs, path, ω) ⇓ (`File@Read`{`handle`: h}, ω_1) ∧ FileReadAllBytes(h, ω_1) ⇓ (r, ω_2) ∧ FileClose(h, ω_2) ⇓ (ok, ω')
```

```text
¬ HandleOpen(ω, h) ⇒ FileReadAll(h, ω) ⇓ (IoError::IoFailure, ω)
¬ HandleOpen(ω, h) ⇒ FileReadAllBytes(h, ω) ⇓ (IoError::IoFailure, ω)
¬ HandleOpen(ω, h) ⇒ FileWrite(h, data, ω) ⇓ (IoError::IoFailure, ω)
¬ HandleOpen(ω, h) ⇒ FileFlush(h, ω) ⇓ (IoError::IoFailure, ω)
```

```text
FileReadAll(h, ω) ⇓ (r, ω') ∧ r ≠ IoError::IoFailure ⇒ HandlePos(ω', h) = HandleLen(ω, h)
FileReadAllBytes(h, ω) ⇓ (r, ω') ∧ r ≠ IoError::IoFailure ⇒ HandlePos(ω', h) = HandleLen(ω, h)
```

```text
FileWrite(h, data, ω) ⇓ (ok, ω') ⇒ HandleOpen(ω, h) ∧ (HandleMode(ω, h) = `Append` ⇒ HandlePos(ω', h) = HandleLen(ω, h) + ByteLen(data)) ∧ (HandleMode(ω, h) ≠ `Append` ⇒ HandlePos(ω', h) = HandlePos(ω, h) + ByteLen(data))
FileWrite(h, data, ω) ⇓ (ok, ω') ⇒ HandleLen(ω', h) = max(HandleLen(ω, h), HandlePos(ω', h))
```

```text
FileFlush(h, ω) ⇓ (ok, ω') ⇒ Flushed(ω', h)
FileClose(h, ω) ⇓ (ok, ω') ⇒ HandleStateOf(ω', h) = `Closed`
```

```text
FSOpenDir(fs, path, ω) ⇓ (`DirIter@Open`{`handle`: h}, ω') ⇒ DirIterOpen(ω', h) ∧ DirIterFS(ω', h) = fs ∧ DirIterPath(ω', h) = path ∧ DirIterEntries(ω', h) = DirEntries(fs, path, ω) ∧ DirIterPos(ω', h) = 0
```

```text
¬ DirIterOpen(ω, h) ⇒ DirNext(h, ω) ⇓ (IoError::IoFailure, ω)
DirIterOpen(ω, h) ∧ DirIterPos(ω, h) = i ∧ i ≥ |DirIterEntries(ω, h)| ⇒ DirNext(h, ω) ⇓ ((), ω)
DirIterOpen(ω, h) ∧ DirIterPos(ω, h) = i ∧ i < |DirIterEntries(ω, h)| ∧ entry = DirIterEntries(ω, h)[i] ⇒ DirNext(h, ω) ⇓ (entry, ω_2) ∧ DirIterPos(ω_2, h) = i + 1
```

```text
DirClose(h, ω) ⇓ (ok, ω') ⇒ ¬ DirIterOpen(ω', h)
```

#### 6.2.2 System Primitive Relations

```text
SysState = ⟨env, exit_code_opt⟩
Env(⟨env, exit_code_opt⟩) = env
ExitCode(⟨env, exit_code_opt⟩) = exit_code_opt
SetExitCode(⟨env, _⟩, code) = ⟨env, code⟩
```

```text
SystemJudg = {SystemGetEnv(key) ⇓ r, SystemExit(code) ⇓ ok, SystemRun(command) ⇓ code}
SystemJudg_sys = {SystemGetEnv(key, sys) ⇓ (r, sys'), SystemExit(code, sys) ⇓ sys', SystemRun(command, sys) ⇓ (code, sys')}
```

```text
SystemGetEnv(key) ⇓ r ⇔ ∃ sys, sys'. SystemGetEnv(key, sys) ⇓ (r, sys')
SystemExit(code) ⇓ ok ⇔ ∃ sys, sys'. SystemExit(code, sys) ⇓ sys'
SystemRun(command) ⇓ code ⇔ ∃ sys, sys'. SystemRun(command, sys) ⇓ (code, sys')
```

```text
EmptyStringVal = v ⇔ ∃ lit. lit.kind = StringLiteral ∧ StringBytes(lit) = [] ∧ LiteralValue(lit, TypeString(`@View`)) = v
```

**(System-GetEnv-Ok)**
Env(sys)[key] = v
──────────────────────────────────────────────

```text
SystemGetEnv(key, sys) ⇓ (v, sys)
```

**(System-GetEnv-None)**

```text
key ∉ dom(Env(sys))
```

──────────────────────────────────────────────

```text
SystemGetEnv(key, sys) ⇓ (v, sys)    EmptyStringVal = v
```

**(System-Exit)**
sys' = SetExitCode(sys, code)
──────────────────────────────────────────────

```text
SystemExit(code, sys) ⇓ sys'
```

**(System-Run)**

```text
HostRun(command) ⇓ code
```

──────────────────────────────────────────────

```text
SystemRun(command, sys) ⇓ (code, sys)
```

#### 6.2.3 Network Primitive Relations

```text
NetworkJudg = {NetRestrictHost(v_net, host) ⇓ v_net'}
```

`NetRestrictHost` is a runtime host-primitive relation with required semantics.

A conforming implementation MUST satisfy all of the following:
1. `NetRestrictHost(v_net, host) ⇓ v_net'` implies `v_net'` denotes a capability whose network authority is a subset of `v_net`.
2. Any connection, bind, or name-resolution operation performed through `v_net'` MUST be rejected unless its effective host equals `host`.
3. Rejection under rule 2 MUST occur before any externally observable network effect is performed.
4. `NetRestrictHost` MUST NOT invalidate `v_net` and MUST NOT mutate unrelated capability state.

#### 6.2.4 Primitive Method Application

```text
HandleOf(v) = h ⇔ v = `File@Read`{`handle`: h} ∨ v = `File@Write`{`handle`: h} ∨ v = `File@Append`{`handle`: h}
DirHandleOf(v) = h ⇔ v = `DirIter@Open`{`handle`: h}
```

MethodName(MethodDecl(_, _, _, name, _, _, _, _, _, _, _, _)) = name
MethodName(ClassMethodDecl(_, _, name, _, _, _, _, _, _, _, _)) = name
MethodName(StateMethodDecl(_, _, name, _, _, _, _, _, _, _, _)) = name
MethodName(TransitionDecl(_, _, name, _, _, _, _, _)) = name

```text
MethodOwner(m) = owner ⇔ ∃ T. MethodByName(T, MethodName(m)) = m ∧ owner = T
MethodOwner(m) = ModalStateRef(modal_ref, S) ⇔ ModalDeclOf(modal_ref) = M ∧ (m ∈ Methods(M, S) ∨ m ∈ Transitions(M, S))
PrimCallJudg = {PrimCall(Owner, name, v_self, args) ⇓ out}
```

**(Prim-FS-OpenRead)**

```text
Γ ⊢ FSOpenRead(v_fs, p) ⇓ r
```

──────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `open_read`, v_fs, [p]) ⇓ Val(r)
```

**(Prim-FS-OpenWrite)**

```text
Γ ⊢ FSOpenWrite(v_fs, p) ⇓ r
```

───────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `open_write`, v_fs, [p]) ⇓ Val(r)
```

**(Prim-FS-OpenAppend)**

```text
Γ ⊢ FSOpenAppend(v_fs, p) ⇓ r
```

────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `open_append`, v_fs, [p]) ⇓ Val(r)
```

**(Prim-FS-CreateWrite)**

```text
Γ ⊢ FSCreateWrite(v_fs, p) ⇓ r
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `create_write`, v_fs, [p]) ⇓ Val(r)
```

**(Prim-FS-ReadFile)**

```text
Γ ⊢ FSReadFile(v_fs, p) ⇓ r
```

──────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `read_file`, v_fs, [p]) ⇓ Val(r)
```

**(Prim-FS-ReadBytes)**

```text
Γ ⊢ FSReadBytes(v_fs, p) ⇓ r
```

───────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `read_bytes`, v_fs, [p]) ⇓ Val(r)
```

**(Prim-FS-WriteFile)**

```text
Γ ⊢ FSWriteFile(v_fs, p, d) ⇓ r
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `write_file`, v_fs, [p, d]) ⇓ Val(r)
```

**(Prim-FS-WriteStdout)**

```text
Γ ⊢ FSWriteStdout(v_fs, d) ⇓ r
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `write_stdout`, v_fs, [d]) ⇓ Val(r)
```

**(Prim-FS-WriteStderr)**

```text
Γ ⊢ FSWriteStderr(v_fs, d) ⇓ r
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `write_stderr`, v_fs, [d]) ⇓ Val(r)
```

**(Prim-FS-Exists)**

```text
Γ ⊢ FSExists(v_fs, p) ⇓ b
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `exists`, v_fs, [p]) ⇓ Val(b)
```

**(Prim-FS-Remove)**

```text
Γ ⊢ FSRemove(v_fs, p) ⇓ r
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `remove`, v_fs, [p]) ⇓ Val(r)
```

**(Prim-FS-OpenDir)**

```text
Γ ⊢ FSOpenDir(v_fs, p) ⇓ r
```

──────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `open_dir`, v_fs, [p]) ⇓ Val(r)
```

**(Prim-FS-CreateDir)**

```text
Γ ⊢ FSCreateDir(v_fs, p) ⇓ r
```

────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `create_dir`, v_fs, [p]) ⇓ Val(r)
```

**(Prim-FS-EnsureDir)**

```text
Γ ⊢ FSEnsureDir(v_fs, p) ⇓ r
```

────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `ensure_dir`, v_fs, [p]) ⇓ Val(r)
```

**(Prim-FS-Kind)**

```text
Γ ⊢ FSKind(v_fs, p) ⇓ r
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `kind`, v_fs, [p]) ⇓ Val(r)
```

**(Prim-FS-Restrict)**

```text
Γ ⊢ FSRestrict(v_fs, p) ⇓ v_fs'
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`FileSystem`, `restrict`, v_fs, [p]) ⇓ Val(v_fs')
```

**(Prim-File-ReadAll)**

```text
HandleOf(v) = h    Γ ⊢ FileReadAll(h) ⇓ r
```

───────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(ModalStateRef(["File"], `@Read`), `read_all`, v, []) ⇓ Val(r)
```

**(Prim-File-ReadAllBytes)**

```text
HandleOf(v) = h    Γ ⊢ FileReadAllBytes(h) ⇓ r
```

────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(ModalStateRef(["File"], `@Read`), `read_all_bytes`, v, []) ⇓ Val(r)
```

**(Prim-File-Write)**

```text
HandleOf(v) = h    Γ ⊢ FileWrite(h, d) ⇓ r
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(ModalStateRef(["File"], `@Write`), `write`, v, [d]) ⇓ Val(r)
```

**(Prim-File-Flush)**

```text
HandleOf(v) = h    Γ ⊢ FileFlush(h) ⇓ r
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(ModalStateRef(["File"], `@Write`), `flush`, v, []) ⇓ Val(r)
```

**(Prim-File-Write-Append)**

```text
HandleOf(v) = h    Γ ⊢ FileWrite(h, d) ⇓ r
```

─────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(ModalStateRef(["File"], `@Append`), `write`, v, [d]) ⇓ Val(r)
```

**(Prim-File-Flush-Append)**

```text
HandleOf(v) = h    Γ ⊢ FileFlush(h) ⇓ r
```

─────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(ModalStateRef(["File"], `@Append`), `flush`, v, []) ⇓ Val(r)
```

**(Prim-File-Close-Read)**

```text
HandleOf(v) = h    Γ ⊢ FileClose(h) ⇓ ok
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(ModalStateRef(["File"], `@Read`), `close`, v, []) ⇓ Val(`File@Closed`{})
```

**(Prim-File-Close-Write)**

```text
HandleOf(v) = h    Γ ⊢ FileClose(h) ⇓ ok
```

───────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(ModalStateRef(["File"], `@Write`), `close`, v, []) ⇓ Val(`File@Closed`{})
```

**(Prim-File-Close-Append)**

```text
HandleOf(v) = h    Γ ⊢ FileClose(h) ⇓ ok
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(ModalStateRef(["File"], `@Append`), `close`, v, []) ⇓ Val(`File@Closed`{})
```

**(Prim-Dir-Next)**

```text
DirHandleOf(v) = h    Γ ⊢ DirNext(h) ⇓ r
```

─────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(ModalStateRef(["DirIter"], `@Open`), `next`, v, []) ⇓ Val(r)
```

**(Prim-Dir-Close)**

```text
DirHandleOf(v) = h    Γ ⊢ DirClose(h) ⇓ ok
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(ModalStateRef(["DirIter"], `@Open`), `close`, v, []) ⇓ Val(`DirIter@Closed`{})
```

**(Prim-System-GetEnv)**

```text
Γ ⊢ SystemGetEnv(k) ⇓ r
```

──────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`System`, `get_env`, v_sys, [k]) ⇓ Val(r)
```

**(Prim-System-ExecutablePath)**

```text
Γ ⊢ SystemExecutablePath() ⇓ path
```

────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`System`, `executable_path`, v_sys, []) ⇓ Val(path)
```

**(Prim-System-ArgumentCount)**

```text
Γ ⊢ SystemArgumentCount() ⇓ n
```

────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`System`, `argument_count`, v_sys, []) ⇓ Val(n)
```

**(Prim-System-Argument)**

```text
Γ ⊢ SystemArgument(index) ⇓ text    index < SystemArgumentCount()
```

────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`System`, `argument`, v_sys, [index]) ⇓ Val(text)
```

**(Prim-System-CurrentDirectory)**

```text
Γ ⊢ SystemCurrentDirectory() ⇓ path
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`System`, `current_directory`, v_sys, []) ⇓ Val(path)
```

**(Prim-System-Exit)**

```text
Γ ⊢ SystemExit(code) ⇓ ok
```

──────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`System`, `exit`, v_sys, [code]) ⇓ Ctrl(Abort)
```

**(Prim-System-Run)**

```text
Γ ⊢ SystemRun(command) ⇓ code
```

──────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`System`, `run`, v_sys, [command]) ⇓ Val(code)
```

**(Prim-Network-RestrictHost)**

```text
Γ ⊢ NetRestrictHost(v_net, host) ⇓ v_net'
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`Network`, `restrict_to_host`, v_net, [host]) ⇓ Val(v_net')
```

When `PrimCall(System, exit, ...)` yields `Ctrl(Abort)`, program execution terminates and the observable exit status is `code`.

### 6.3 Binding and Permission Runtime State

#### 6.3.1 Binding State

```text
BindingState ::= Valid | Moved | PartiallyMoved(F)    (F ⊆ Name)
```

Movability ::= mov | immov
Responsibility ::= resp | alias
Mutability = {`let`, `var`}

```text
BindInfo ::= ⟨state, mov, mut, resp⟩
```

BindScope = Map(Identifier, BindInfo)
𝔅 = [BindScope]

PushScope_B(𝔅) = [∅] ++ 𝔅
PopScope_B([_] ++ 𝔅) = 𝔅

```text
Lookup_B([σ] ++ 𝔅', x) =
  { σ[x]                if x ∈ dom(σ)
```

    Lookup_B(𝔅', x)     otherwise }

```text
Lookup_B([], x) = ⊥
```

```text
Update_B([σ] ++ 𝔅', x, info) =
  { [σ[x ↦ info]] ++ 𝔅'            if x ∈ dom(σ)
    [σ] ++ Update_B(𝔅', x, info)   otherwise }
Update_B([], x, info) = ⊥
```

```text
Intro_B([σ] ++ 𝔅', x, info) = [σ[x ↦ info]] ++ 𝔅'
```

#### 6.3.2 Permission Activity State

PermOf(TypePerm(p, T)) = p

```text
PermOf(T) = `const`    if T ≠ TypePerm(_, _)
```

ActiveState ::= Active | Inactive

PermKey = Identifier × FieldPath
PermScope = Map(PermKey, ActiveState)
Π = [PermScope]

PushScope_Π(Π) = [∅] ++ Π
PopScope_Π([_] ++ Π) = Π

```text
Lookup_Π([σ] ++ Π', k) =
  { Inactive             if k ∈ dom(σ) ∧ σ[k] = Inactive
```

    Lookup_Π(Π', k)      otherwise }
Lookup_Π([], k) = Active

```text
Update_Π([σ] ++ Π', k, s) = [σ[k ↦ s]] ++ Π'
```

#### 6.3.3 Join and Transition Operations

JoinState(Moved, s) = Moved
JoinState(s, Moved) = Moved

```text
JoinState(PartiallyMoved(F_1), PartiallyMoved(F_2)) = PartiallyMoved(F_1 ∪ F_2)
```

JoinState(Valid, PartiallyMoved(F)) = PartiallyMoved(F)
JoinState(PartiallyMoved(F), Valid) = PartiallyMoved(F)
JoinState(Valid, Valid) = Valid

```text
StateTransition = Valid → Moved | Valid → PartiallyMoved(F) | PartiallyMoved(F) → PartiallyMoved(F ∪ {f}) | PartiallyMoved(F) → Moved
```

**(Trans-Move-Whole)**

```text
Lookup_B(𝔅, x) = ⟨Valid, mv, mut, resp⟩    MoveWhole(x) occurs
```

────────────────────────────────────────────────────────────────

```text
Update_B(𝔅, x, ⟨Moved, mv, mut, resp⟩)
```

**(Trans-Move-Field)**

```text
Lookup_B(𝔅, x) = ⟨Valid, mv, mut, resp⟩    MoveField(x, f) occurs
```

────────────────────────────────────────────────────────────────────

```text
Update_B(𝔅, x, ⟨PartiallyMoved({f}), mv, mut, resp⟩)
```

**(Trans-Move-Field-Partial)**

```text
Lookup_B(𝔅, x) = ⟨PartiallyMoved(F), mv, mut, resp⟩    MoveField(x, f) occurs    f ∉ F
```

────────────────────────────────────────────────────────────────────────────────────────

```text
Update_B(𝔅, x, ⟨PartiallyMoved(F ∪ {f}), mv, mut, resp⟩)
```

**(Trans-Partial-To-Moved)**

```text
Lookup_B(𝔅, x) = ⟨PartiallyMoved(F), mv, mut, resp⟩    AllFields(TypeOf(x)) = F
```

────────────────────────────────────────────────────────────────────────────────────────

```text
Update_B(𝔅, x, ⟨Moved, mv, mut, resp⟩)
```

**(Trans-Reassign)**

```text
Lookup_B(𝔅, x) = ⟨s, mv, `var`, resp⟩    Reassign(x, v) occurs    s ∈ {Moved, PartiallyMoved(_)}
```

──────────────────────────────────────────────────────────────────────────────────────────────────

```text
Update_B(𝔅, x, ⟨Valid, mv, `var`, resp⟩)
```

**(Trans-Moved-NoAccess)**

```text
Lookup_B(𝔅, x) = ⟨Moved, _, _, _⟩    Read(x) ∨ Move(x) occurs
```

────────────────────────────────────────────────────────────────

```text
⇑ Code(E-MEM-3001)
```

**(Trans-Partial-NoAccess)**

```text
Lookup_B(𝔅, x) = ⟨PartiallyMoved(F), _, _, _⟩    Read(x.f) ∨ Move(x.f) occurs    f ∈ F
```

──────────────────────────────────────────────────────────────────────────────────────────

```text
⇑ Code(E-MEM-3001)
```

**(Trans-Let-NoReassign)**

```text
Lookup_B(𝔅, x) = ⟨s, mv, `let`, resp⟩    Reassign(x, v) occurs    s ∈ {Moved, PartiallyMoved(_)}
```

────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⇑ Code(E-MEM-3006)
```

```text
JoinBindInfo(⟨s_1, mv_1, mut_1, resp_1⟩, ⟨s_2, mv_2, mut_2, resp_2⟩) =
  { ⟨JoinState(s_1, s_2), mv_1, mut_1, resp_1⟩   if mv_1 = mv_2 ∧ mut_1 = mut_2 ∧ resp_1 = resp_2
    ⊥                                            otherwise }
```

JoinScope_B(B_1, B_2) =

```text
  { { x ↦ JoinBindInfo(B_1[x], B_2[x]) | x ∈ dom(B_1) }    if dom(B_1) = dom(B_2) ∧ ∀ x ∈ dom(B_1). JoinBindInfo(B_1[x], B_2[x]) ≠ ⊥
    ⊥                                                      otherwise }
```

Join_B([], []) = []
Join_B(B_1 :: 𝔅_1, B_2 :: 𝔅_2) =

```text
  { JoinScope_B(B_1, B_2) :: Join_B(𝔅_1, 𝔅_2)    if JoinScope_B(B_1, B_2) ≠ ⊥ ∧ Join_B(𝔅_1, 𝔅_2) ≠ ⊥
    ⊥                                           otherwise }
Join_B(𝔅_1, 𝔅_2) = ⊥    if |𝔅_1| ≠ |𝔅_2|
```

JoinPermState(Active, Active) = Active
JoinPermState(_, _) = Inactive    otherwise

PermAt(B, x) =

```text
  { B[x]     if x ∈ dom(B)
```

    Active   otherwise }

```text
JoinScope_Π(B_1, B_2) = { x ↦ JoinPermState(PermAt(B_1, x), PermAt(B_2, x)) | x ∈ dom(B_1) ∪ dom(B_2) }
```

JoinPerm([], []) = []
JoinPerm(B_1 :: Π_1, B_2 :: Π_2) =

```text
  { JoinScope_Π(B_1, B_2) :: JoinPerm(Π_1, Π_2)    if JoinScope_Π(B_1, B_2) ≠ ⊥ ∧ JoinPerm(Π_1, Π_2) ≠ ⊥
    ⊥                                             otherwise }
JoinPerm(Π_1, Π_2) = ⊥    if |Π_1| ≠ |Π_2|
```

#### 6.3.4 Access and Binding Introduction Helpers

```text
FieldHead(Identifier(x)) = ⊥
```

FieldHead(FieldAccess(p, f)) =

```text
  { f                if FieldHead(p) = ⊥
```

    FieldHead(p)     otherwise }
FieldHead(TupleAccess(p, _)) = FieldHead(p)
FieldHead(IndexAccess(p, _)) = FieldHead(p)

```text
FieldHead(Deref(p)) = ⊥
```

FieldPath = [Name]
FieldPathOf(Identifier(x)) = []
FieldPathOf(FieldAccess(p, f)) = FieldPathOf(p) ++ [f]
FieldPathOf(TupleAccess(p, _)) = FieldPathOf(p)
FieldPathOf(IndexAccess(p, _)) = FieldPathOf(p)
FieldPathOf(Deref(p)) = []

PlacePath(p) =
  { (PlaceRoot(p), [])               if p = Identifier(x)
    (PlaceRoot(p), FieldPathOf(p))   otherwise }

Prefixes([]) = [[]]

```text
Prefixes([f] ++ fs) = [[]] ∪ { [f] ++ p | p ∈ Prefixes(fs) }
AncPaths(p) = { (PlaceRoot(p), fp) | fp ∈ Prefixes(FieldPathOf(p)) }
AccessPathOk(Π, p) ⇔ ∀ k ∈ AncPaths(p). Lookup_Π(Π, k) = Active
```

SuspendUniquePath(Π, mode, p) =

```text
  { SetTop(Π, InactivateScope(Top(Π), AncPaths(p)))    if mode = ⊥ ∧ IsPlace(p) ∧ PermOf(ExprType(p)) = `unique`
```

    Π                                                 otherwise }
SuspendUnique(Π, mode, e) =
  { SuspendUniquePath(Π, mode, e)    if IsPlace(e)
    Π                               otherwise }

```text
RemoveKeys(σ, D) = { k ↦ σ[k] | k ∈ dom(σ) ∧ k ∉ D }
Reactivate([σ] ++ Π', D) = [RemoveKeys(σ, D)] ++ Π'
```

ArgPassExpr(mode, moved, e) =

```text
  { MovedArg(moved, e)          if mode = `move` ∧ moved = true
    MovedArg(true, CallTemp(e)) if mode = `move` ∧ moved = false ∧ ¬ HasSourceProvenance(e)
    RefArgExpr(e)               if mode = ⊥ ∧ moved = false
```

    e                           otherwise }

AccessStateOk(Valid, p) = true

```text
AccessStateOk(PartiallyMoved(F), p) = (FieldHead(p) = f ∧ f ∉ F)
```

AccessStateOk(Moved, p) = false
PM(Valid, f) = PartiallyMoved({f})

```text
PM(PartiallyMoved(F), f) = PartiallyMoved(F ∪ {f})
PM(Moved, f) = ⊥
```

```text
ExprType(e) = T ⇔ Γ; R; L ⊢ e : T
ExprType(p) = T ⇔ IsPlace(p) ∧ Γ; R; L ⊢ p :place T
```

```text
AccessOk_B(𝔅, p) ⇔ x = PlaceRoot(p) ∧ Lookup_B(𝔅, x) = ⟨s, _, _, _⟩ ∧ AccessStateOk(s, p)
AccessOk_Π(Π, p) ⇔ (PermOf(ExprType(p)) ≠ `unique`) ∨ AccessPathOk(Π, p)
AccessOk(𝔅, Π, p) ⇔ AccessOk_B(𝔅, p) ∧ AccessOk_Π(Π, p)
```

MovOf("=") = mov
MovOf(":=") = immov

IsMoveExpr(MoveExpr(_)) = true
IsMoveExpr(_) = false

RespOfInit(init) =

```text
  { resp    if ¬ IsPlace(init)
```

    resp    if IsMoveExpr(init)
    alias   otherwise }

**Temporary Lifetime.**

```text
InitExpr(⟨_, _, _, init, _⟩) = init
```

```text
BindInitScope(e) = BindScope(s) ⇔
  (s = LetStmt(binding) ∧ InitExpr(binding) = e) ∨
  (s = VarStmt(binding) ∧ InitExpr(binding) = e)
```

TempScope(e) =

```text
  { BindInitScope(e)            if BindInitScope(e) ≠ ⊥
```

    StmtScope(EnclosingStmt(e)) otherwise }

```text
TempValue(e) ⇔ ¬ IsPlace(e)
```

TempOrderList([]) = []
TempOrderList([e] ++ es) = TempOrder(e) ++ TempOrderList(es)

TempOrder(e) =
  { TempOrderList(Children_LTR(e)) ++ [e]    if TempValue(e)
    TempOrderList(Children_LTR(e))           otherwise }

TempOrderStmt(s) = TempOrderList(StmtExprs(s))

ControlExpr(ReturnStmt(e)) = e
ControlExpr(BreakStmt(e)) = e

```text
ControlExpr(s) = ⊥    if s ∉ {ReturnStmt(_), BreakStmt(_)}
```

```text
TempStmtList(s) = [ e ∈ TempOrderStmt(s) | TempScope(e) = StmtScope(s) ∧ e ≠ ControlExpr(s) ]
```

TempDropOrder(s) = Rev(TempStmtList(s))

```text
OptList(⊥) = []
OptList(e) = [e]    if e ≠ ⊥
```

```text
StmtExprs(LetStmt(⟨_, _, _, init, _⟩)) = [init]
StmtExprs(VarStmt(⟨_, _, _, init, _⟩)) = [init]
```

StmtExprs(UsingLocalStmt(_, _, _)) = []
StmtExprs(AssignStmt(p, e)) = [e, p]
StmtExprs(CompoundAssignStmt(p, _, e)) = [p, e]
StmtExprs(ExprStmt(e)) = [e]
StmtExprs(ReturnStmt(e_opt)) = OptList(e_opt)
StmtExprs(BreakStmt(e_opt)) = OptList(e_opt)
StmtExprs(ContinueStmt) = []
StmtExprs(DeferStmt(_)) = []
StmtExprs(UnsafeBlockStmt(b)) = [b]
StmtExprs(RegionStmt(opts_opt, _, b)) = [RegionOptsExpr(opts_opt), b]
StmtExprs(FrameStmt(_, b)) = [b]
StmtExprs(ErrorStmt(_)) = []

StmtScope(s) = s
BindScope(s) = BlockOfStmt(s)

```text
EnclosingStmt(e) = s ⇔ e ∈ SubExprs(s) ∧ ∀ s' ∈ SubStmts(s). e ∉ SubExprs(s')
BlockOfStmt(s) = b ⇔ s ∈ BlockStmts(b) ∧ ∀ b' ∈ SubBlocks(b). s ∉ BlockStmts(b')
```

BlockStmts(BlockExpr(stmts, _)) = stmts

StmtBlocks(UnsafeBlockStmt(b)) = [b]
StmtBlocks(DeferStmt(b)) = [b]
StmtBlocks(RegionStmt(_, _, b)) = [b]
StmtBlocks(FrameStmt(_, b)) = [b]

```text
StmtBlocks(s) = []    if s ∉ {UnsafeBlockStmt(_), DeferStmt(_), RegionStmt(_, _, _), FrameStmt(_, _)}
```

SubExprs(s) = SubExprsList(StmtExprs(s))
SubExprsList([]) = ∅

```text
SubExprsList([e] ++ es) = {e} ∪ SubExprsList(Children_LTR(e)) ∪ SubExprsList(es)
```

SubStmts(s) = SubStmtsList(StmtBlocks(s))
SubStmtsList([]) = ∅

```text
SubStmtsList([b] ++ bs) = BlockStmts(b) ∪ SubStmtsSeq(BlockStmts(b)) ∪ SubStmtsList(bs)
```

SubStmtsSeq([]) = ∅

```text
SubStmtsSeq([s] ++ ss) = SubStmts(s) ∪ SubStmtsSeq(ss)
```

SubBlocks(b) = SubBlocksSeq(BlockStmts(b))
SubBlocksSeq([]) = ∅

```text
SubBlocksSeq([s] ++ ss) = StmtBlocks(s) ∪ (⋃_{b' ∈ StmtBlocks(s)} SubBlocks(b')) ∪ SubBlocksSeq(ss)
```

```text
Entries(B) = [⟨x_1, B[x_1]⟩, …, ⟨x_n, B[x_n]⟩] ⇔ [x_1, …, x_n] enumerates dom(B) without repetition
```

```text
MapUnion(M_1, M_2) = { x ↦ (M_2[x] if x ∈ dom(M_2) else M_1[x]) | x ∈ dom(M_1) ∪ dom(M_2) }
```

```text
IntroAll_B([σ] ++ 𝔅', B) = [MapUnion(σ, B)] ++ 𝔅'
```

```text
BindInfoMap(f, B, mv, mut) = { x ↦ ⟨Valid, MovEff(mv, f(B[x])), mut, f(B[x])⟩ | x ∈ dom(B) }
```

MovEff(mv, resp) = mv
MovEff(mv, alias) = immov

T_Region = TypeModalState([`Region`], `Active`)

```text
RegionBindName(Γ, alias_opt) =
  { alias_opt         if alias_opt ≠ ⊥
    FreshRegion(Γ)    otherwise }
RegionBindMap(Γ, alias_opt) = { r ↦ T_Region | r = RegionBindName(Γ, alias_opt) }
RegionBindInfo(Γ, alias_opt) = BindInfoMap(λ U. resp, RegionBindMap(Γ, alias_opt), mov, `let`)
FrameBindInfo(Γ) = RegionBindInfo(Γ, ⊥)
```

Names(B) = dom(B)

```text
JoinAll_B([]) = ⊥
```

JoinAll_B([𝔅]) = 𝔅
JoinAll_B(𝔅_1 :: 𝔅_2 :: rest) = JoinAll_B([Join_B(𝔅_1, 𝔅_2)] ++ rest)

```text
JoinAllPerm([]) = ⊥
```

JoinAllPerm([Π]) = Π
JoinAllPerm(Π_1 :: Π_2 :: rest) = JoinAllPerm([JoinPerm(Π_1, Π_2)] ++ rest)

```text
Top([σ] ++ Π') = σ
SetTop([σ] ++ Π', σ') = [σ'] ++ Π'
InactivateScope(σ, K) = { x ↦ (Inactive if x ∈ K else σ[x]) | x ∈ dom(σ) ∪ K }
Roots(Π_2, Π_1) = { k | Top(Π_2)[k] = Inactive ∧ Lookup_Π(Π_1, k) = Active }
```

ConsumeOnMove(𝔅, e) =

```text
  { Update_B(𝔅, x, ⟨Moved, mv, mut, resp⟩)    if IsMoveExpr(e) ∧ x = PlaceRoot(MoveInner(e)) ∧ Lookup_B(𝔅, x) = ⟨s, mv, mut, resp⟩
```

    𝔅                                         otherwise }

MoveInner(MoveExpr(p)) = p

```text
BJudgment = {Γ; 𝔅; Π ⊢ e ⇒ 𝔅' ▷ Π', Γ; 𝔅; Π ⊢ s ⇒ 𝔅' ▷ Π'}
```

```text
StaticBindTypesMod(P, m) = ++_{item ∈ ASTModule(P, m).items, item = StaticDecl(_, _, _, binding, _, _)} StaticBindTypes(binding)
StaticBindInfo(item) = BindInfoMap(λ U. RespOfInit(init), StaticBindTypes(binding), MovOf(op), mut) ⇔ item = StaticDecl(_, _, mut, binding, _, _) ∧ binding = ⟨_, _, op, init, _⟩
StaticBindMap(P, m) = ++_{item ∈ ASTModule(P, m).items, item = StaticDecl(_, _, _, _, _, _)} StaticBindInfo(item)
```

**Procedure Entry.**

```text
𝔅_global = IntroAll_B(PushScope_B(𝔅), StaticBindMap(Project(Γ), m))
```

𝔅_proc = IntroAll_B(PushScope_B(𝔅_global), ParamBindMap(params))
ParamBindMap([]) = ∅

```text
ParamBindMap([⟨mode, x, T⟩] ++ ps) = MapUnion(ParamBindMap(ps), { x ↦ ⟨Valid, ParamMov(mode), `let`, ParamResp(mode)⟩ })
```

MethodParamBindMap(base, name) = ParamBindMap(RecvParams(base, name))
ParamTypeMap([]) = ∅

```text
ParamTypeMap([⟨mode, x, T⟩] ++ ps) = MapUnion(ParamTypeMap(ps), { x ↦ T })
ParamMov(`move`) = mov    ParamMov(⊥) = immov
ParamResp(`move`) = resp    ParamResp(⊥) = alias
```

```text
Init_B(m, params) = IntroAll_B(PushScope_B(IntroAll_B(PushScope_B([]), StaticBindMap(Project(Γ), m))), ParamBindMap(params))
Init_Π(m, params) = [{ x ↦ Active | (x:T) ∈ ParamTypeMap(params) ∧ PermOf(T) = `unique` }] ++ [{ x ↦ Active | (x:T) ∈ StaticBindTypesMod(Project(Γ), m) ∧ PermOf(T) = `unique` }]
```

```text
BindCheck(m, params, body) ⇓ ok ⇔ Γ; Init_B(m, params); Init_Π(m, params) ⊢ body ⇒ 𝔅' ▷ Π'
```

```text
ProcBindCheck(m, ProcedureDecl(_, _, _, _, _, params, _, _, body, _, _)) ⇓ ok ⇔ BindCheck(m, params, body) ⇓ ok
```

```text
MethodParamsDecl(T, m) = [⟨RecvMode(m.receiver), `self`, RecvType(T, m.receiver)⟩] ++ m.params
MethodBindCheck(m, T, md) ⇓ ok ⇔ md.body = body ∧ BindCheck(m, MethodParamsDecl(T, md), body) ⇓ ok
ClassMethodBindCheck(m, Cl, md) ⇓ ok ⇔ md.body_opt = body ∧ BindCheck(m, ClassMethodParams(Cl, md), body) ⇓ ok
StateMethodBindCheck(m, M, S, md) ⇓ ok ⇔ md.body = body ∧ BindCheck(m, StateMethodParams(M, S, md), body) ⇓ ok
TransitionBindCheck(m, M, S, tr) ⇓ ok ⇔ tr.body = body ∧ BindCheck(m, TransitionParams(M, S, tr), body) ⇓ ok
```

BindDiagRefs = {"8.2", "8.7", "8.10"}

This chapter defines only the environments and helper operations. Feature-specific `BJudgment` clauses are owned by the consuming chapters.

### 6.4 Regions, Frames, and Provenance

#### 6.4.1 Built-In Region Options and Region Helpers

RegionOptionsFields = [

```text
  ⟨⊥, `public`, false, `stack_size`, TypePrim("usize"), Literal(IntLiteral(0)), ⊥, ⊥⟩,
  ⟨⊥, `public`, false, `name`, TypeString(⊥), Literal(StringLiteral("\"")), ⊥, ⊥⟩
```

]

```text
RegionOptionsDecl = RecordDecl(⊥, `public`, `RegionOptions`, ⊥, ⊥, [], RegionOptionsFields, ⊥, ⊥, ⊥)
Σ.Types[`RegionOptions`] = RegionOptionsDecl
```

RegionPrealloc(opts) = opts.stack_size

```text
NoPrealloc(opts) ⇔ RegionPrealloc(opts) = 0
```

```text
RegionActiveType(T) ⇔ StripPerm(T) = TypeModalState([`Region`], `Active`)
```

```text
FreshRegion(Γ) ∈ Name \ dom(Γ)
```

```text
RegionOptsExpr(⊥) = Call(Identifier(`RegionOptions`), [])
RegionOptsExpr(e) = e    if e ≠ ⊥
```

```text
RegionBind(Γ, alias_opt) = Γ_r ⇔ r =
  { alias_opt           if alias_opt ≠ ⊥
    FreshRegion(Γ)      otherwise } ∧ IntroAll(Γ, [⟨r, TypePerm(`unique`, TypeModalState([`Region`], `Active`))⟩]) ⇓ Γ_r
```

```text
InnermostActiveRegion([]) = ⊥
InnermostActiveRegion([σ] ++ Γ') =
  { r                          if ∃ r. r ∈ dom(σ) ∧ RegionActiveType(σ[r])
    InnermostActiveRegion(Γ')  otherwise }
```

```text
FrameBind(Γ, target_opt) = Γ_f ⇔ r =
  { InnermostActiveRegion(Γ)    if target_opt = ⊥
    target_opt                  if target_opt ≠ ⊥ ∧ Γ; R; L ⊢ Identifier(target_opt) : T_r ∧ RegionActiveType(T_r) } ∧ F = FreshRegion(Γ) ∧ IntroAll(Γ, [⟨F, TypePerm(`unique`, TypeModalState([`Region`], `Active`))⟩]) ⇓ Γ_f
```

```text
If `alias_opt = ⊥`, the identifier introduced by `RegionBindName(Γ, alias_opt)` MUST be treated as synthetic. It MUST NOT be introduced by name resolution and MUST NOT be referenced by user code.
```

`FrameBind` introduces a fresh synthetic region identifier `F` with the same restriction. `F` is used only for provenance assignment.

#### 6.4.2 Provenance Tags and Lifetime Order

```text
π ::= π_Global | π_Stack(S) | π_Heap | π_Region(r) | ⊥
```

```text
RegionNesting(r_inner, r_outer) ⇔ ∃ Γ_1, σ_inner, Γ_2, σ_outer, Γ_3. Γ = Γ_1 ++ [σ_inner] ++ Γ_2 ++ [σ_outer] ++ Γ_3 ∧ r_inner ∈ dom(σ_inner) ∧ r_outer ∈ dom(σ_outer)
```

```text
π_1 < π_2 ⇔ (π_1 = π_Region(r_inner) ∧ π_2 = π_Region(r_outer) ∧ RegionNesting(r_inner, r_outer)) ∨ (π_1 = π_Region(r) ∧ π_2 = π_Stack(S)) ∨ (π_1 = π_Stack(S) ∧ π_2 = π_Heap) ∨ (π_1 = π_Heap ∧ π_2 = π_Global) ∨ (π_1 = π_Global ∧ π_2 = ⊥)
```

```text
π_1 ≤ π_2 ⇔ π_1 = π_2 ∨ (π_1 < π_2) ∨ ∃ π. (π_1 < π ∧ π ≤ π_2)
```

```text
FrameTarget(Γ, ⊥) = r ⇔ InnermostActiveRegion(Γ) = r
FrameTarget(Γ, r) = r ⇔ Γ; R; L ⊢ Identifier(r) : T_r ∧ RegionActiveType(T_r)
```

```text
FrameTargetRel(F, r) ⇔ FrameTarget(Γ, F) = r
FrameTargetRel(F, r) ⇒ π_Region(F) < π_Region(r)
```

```text
JoinProv(π_1, π_2) =
  { π_1    if π_1 ≤ π_2
    π_2    if π_2 ≤ π_1
    ⊥      otherwise }
```

```text
JoinAllProv([]) = ⊥
JoinAllProv([π]) = π
JoinAllProv([π_1, π_2] ++ ps) = JoinAllProv([JoinProv(π_1, π_2)] ++ ps)
```

#### 6.4.3 Provenance Environment

```text
Ω = ⟨Σ_π, RS⟩
Scope_π = ⟨S, M⟩ where M : Ident ⇀ π
Σ_π ∈ [Scope_π]
RegionEntry_π = ⟨tag, target⟩
RS ∈ [RegionEntry_π]
```

```text
ScopeId(⟨S, M⟩) = S
ScopeMap(⟨S, M⟩) = M
TopScopeId([⟨S, M⟩] ++ Σ_π) = S
StackProv(Σ_π) = π_Stack(TopScopeId(Σ_π))
```

```text
PushScope_π(Σ_π) = [⟨S, ∅⟩] ++ Σ_π    (S fresh)
PopScope_π([_] ++ Σ_π) = Σ_π
```

```text
Lookup_π([⟨S, M⟩] ++ Σ_π, x) =
  { M[x]                if x ∈ dom(M)
    Lookup_π(Σ_π, x)    otherwise }
```

```text
Intro_π([⟨S, M⟩] ++ Σ_π, x, π) = [⟨S, M[x ↦ π]⟩] ++ Σ_π
```

```text
IntroAll_π(Σ_π, [], π) = Σ_π
IntroAll_π(Σ_π, [x] ++ xs, π) = IntroAll_π(Intro_π(Σ_π, x, π), xs, π)
```

```text
ParamProvMap(params, vecπ) = { x_i ↦ π_i | params = [⟨_, x_i, _⟩], vecπ = [π_i] }
InitProvEnv(params, vecπ, RS) = ⟨[⟨S, ParamProvMap(params, vecπ)⟩], RS⟩    (S fresh)
```

```text
ResolveEntry_π([], tag) = ⊥
ResolveEntry_π([⟨tag_i, target_i⟩] ++ RS, tag) =
  { ⟨tag_i, target_i⟩        if tag_i = tag
    ResolveEntry_π(RS, tag)  otherwise }
```

```text
ResolveTarget_π(⟨Σ_π, RS⟩, tag) = target ⇔ ResolveEntry_π(RS, tag) = ⟨tag, target⟩
```

```text
IntroRegionAlias_π(⟨Σ_π, RS⟩, tag, x) = ⟨Σ_π, [⟨tag, x⟩] ++ RS⟩
```

```text
FreshRegionTag(⟨Σ_π, RS⟩) = tag ⇔ tag ∉ { tag_i | ⟨tag_i, _⟩ ∈ RS }
```

```text
AllocTag([], r) = ⊥
AllocTag([⟨tag, target⟩] ++ RS, ⊥) = tag
AllocTag([⟨tag, target⟩] ++ RS, r) =
```

  { tag              if target = r
    AllocTag(RS, r)  otherwise }

```text
FreshRegionExpr(init) ⇔ init denotes a fresh `Region@Active` value created by region-opening evaluation, including `Region::new_scoped(...)`
```

```text
ProvPlaceJudg = {Γ; Ω ⊢ p ⇓ π}
ProvExprJudg = {Γ; Ω ⊢ e ⇓ π}
ProvStmtJudg = {Γ; Ω ⊢ s ⇒ Ω' ▷ ⟨Res, Brk, BrkVoid⟩, Γ; Ω ⊢ ss ⇒ Ω' ▷ ⟨Res, Brk, BrkVoid⟩}
BlockProvJudg = {Γ; Ω ⊢ BlockProv(stmts, tail_opt) ⇓ π}
```

```text
CaseBodyProv(e, Ω) = π ⇔ Γ; Ω ⊢ e ⇓ π
CaseBodyProv(b, Ω) = π ⇔ Γ; Ω ⊢ b ⇓ π
CaseEnv(⟨Σ_π, RS⟩, pat) = ⟨Σ_π', RS⟩ ⇔ Γ ⊢ PatNames(pat) ⇓ N ∧ π_b = BindProv(⟨Σ_π, RS⟩, ⊥) ∧ Σ_π' = IntroAll_π(Σ_π, N, π_b)
CaseProv(⟨pat, body⟩) = π ⇔ CaseEnv(Ω, pat) = Ω' ∧ CaseBodyProv(body, Ω') = π
CaseElseProv(⊥, Ω) = []
CaseElseProv(b, Ω) = [π] ⇔ CaseBodyProv(b, Ω) = π
```

**(P-Region-Alloc-Method)**

```text
Γ; Ω ⊢ recv ⇓ π_Region(tag)    Γ; Ω ⊢ arg_i ⇓ π_i    for every argument
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ; Ω ⊢ MethodCall(recv, `alloc`, args) ⇓ π_Region(tag)
```

**(P-If-Is)**

```text
CaseProv(⟨pat, then_block⟩) = π_t    CaseElseProv(else_opt, Ω) = π_else    JoinAllProv([π_t] ++ π_else) = π
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; Ω ⊢ IfIsExpr(_, pat, then_block, else_opt) ⇓ π
```

**(P-If-Cases)**

```text
∀ i, CaseProv(case_i) = π_i    CaseElseProv(else_opt, Ω) = π_else    JoinAllProv([π_1, …, π_n] ++ π_else) = π
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; Ω ⊢ IfCaseExpr(_, cases, else_opt) ⇓ π
```

**Closure Provenance.**

```text
ClosureCaptureProv(C, Ω) = [π_x | x ∈ CaptureSet(C) ∧ Lookup_π(Σ_π, x) = π_x]
ClosureTargetProv(C, Ω) =
  { FrameProv(Γ, Ω)    if IsEscaping(C)
    StackProv(Σ_π)     otherwise }
ClosureLocalSharedCaptures(C, Γ) = [x | x ∈ CaptureSet(C) ∧ (∃ S ∈ LocalScopes(Γ). x ∈ dom(S)) ∧ (∃ T. BindOf(Γ, x) = ⟨_, shared T⟩)]
ClosureEscapeCheck(C, Ω) ⇔
  (∀ π_x ∈ ClosureCaptureProv(C, Ω). ¬(π_x < ClosureTargetProv(C, Ω))) ∧
  (¬IsEscaping(C) ∨ ClosureLocalSharedCaptures(C, Γ) = ∅)
```

**(P-Closure-NonCapturing)**

```text
C = ClosureExpr(params, ret_type_opt, body)    CaptureSet(C) = ∅    Γ; Ω ⊢ body ⇓ π_body
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; Ω ⊢ C ⇓ π_Global
```

**(P-Closure-Capturing)**

```text
C = ClosureExpr(params, ret_type_opt, body)    CaptureSet(C) ≠ ∅    ClosureEscapeCheck(C, Ω)
ClosureCaptureProv(C, Ω) = [π_1, …, π_n]    JoinAllProv([π_1, …, π_n]) = π_cap    Γ; Ω ⊢ body ⇓ π_body
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; Ω ⊢ C ⇓ π_cap
```

**(P-Closure-Escape-Err)**

```text
C = ClosureExpr(params, ret_type_opt, body)    CaptureSet(C) ≠ ∅    ¬ClosureEscapeCheck(C, Ω)
∃ x ∈ CaptureSet(C). x ∈ ClosureLocalSharedCaptures(C, Γ) ∨ (Lookup_π(Σ_π, x) = π_x ∧ π_x < ClosureTargetProv(C, Ω))    c = Code(E-CON-0086)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; Ω ⊢ C ⇑ c
```

```text
FrameProv(Γ, ⟨Σ_π, RS⟩) =
  { π_Region(r)    if ∃ r. InnermostFrameRegion(⟨Σ_π, RS⟩) = r
    StackProv(Σ_π) otherwise }
```

**Loop Provenance.**

```text
BreakProv(body, Ω) = ⟨Brk, BrkVoid⟩ ⇔ body = BlockExpr(stmts, tail_opt) ∧ Ω_0 = ⟨PushScope_π(Σ_π), RS⟩ ∧ Γ; Ω_0 ⊢ stmts ⇒ Ω_1 ▷ ⟨Res, Brk, BrkVoid⟩ ∧ (tail_opt = e ⇒ Γ; Ω_1 ⊢ e ⇓ π_t)
```

```text
IterElemProv(iter, Ω) = π ⇔ Γ; Ω ⊢ iter ⇓ π
```

```text
LoopProvInf(Brk, BrkVoid) = ⊥ ⇔ Brk = []
LoopProvInf(Brk, BrkVoid) = π ⇔ Brk = [π_1, …, π_n] ∧ BrkVoid = false ∧ JoinAllProv([π_1, …, π_n]) = π
```

```text
LoopProvFin(Brk, BrkVoid) = ⊥ ⇔ Brk = []
LoopProvFin(Brk, BrkVoid) = π ⇔ Brk = [π_1, …, π_n] ∧ BrkVoid = false ∧ JoinAllProv([π_1, …, π_n]) = π
```

```text
ExtendProv(⟨Σ_π, RS⟩, pat, π) = ⟨Σ_π', RS⟩ ⇔ Γ ⊢ PatNames(pat) ⇓ N ∧ Σ_π' = IntroAll_π(Σ_π, N, π)
```

**(P-Loop-Infinite)**

```text
BreakProv(body, Ω) = ⟨Brk, BrkVoid⟩    LoopProvInf(Brk, BrkVoid) = π
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; Ω ⊢ LoopInfinite(inv_opt, body) ⇓ π
```

**(P-Loop-Conditional)**

```text
BreakProv(body, Ω) = ⟨Brk, BrkVoid⟩    LoopProvFin(Brk, BrkVoid) = π
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; Ω ⊢ LoopConditional(cond, inv_opt, body) ⇓ π
```

**(P-Loop-Iter)**

```text
IterElemProv(iter, Ω) = π_elem    ExtendProv(Ω, pat, π_elem) = Ω'    BreakProv(body, Ω') = ⟨Brk, BrkVoid⟩    LoopProvFin(Brk, BrkVoid) = π
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; Ω ⊢ LoopIter(pat, ty_opt, iter, inv_opt, body) ⇓ π
```

```text
EscapeOk(π_e, π_x) ⇔ ¬(π_e < π_x)
```

The language introduces no general heap-escape conversion. Heap provenance arises only from operations whose declared signatures explicitly accept a `$HeapAllocator` capability and return a heap-backed value.

```text
BindProv(⟨Σ_π, RS⟩, π_init) =
  { StackProv(Σ_π)    if π_init = ⊥
    π_init            otherwise }
```

```text
StaticBindProv = π_Global
AssignProvOk(Ω, p, e) ⇔ Γ; Ω ⊢ p ⇓ π_x ∧ Γ; Ω ⊢ e ⇓ π_e ∧ EscapeOk(π_e, π_x)
```

ProvenanceEscapeJudg = {EscapeOk, AssignProvOk, ClosureEscapeCheck}

```text
The provenance system prevents pointers with shorter lifetimes from escaping to storage with longer lifetimes. The escape check `EscapeOk(π_e, π_x)` is consumed by the feature-local rules for assignments, closures, and async creation.
```

### 6.5 Dynamic Scope Stack, Bindings, and Region Runtime

#### 6.5.1 Dynamic Scope Stack and Binding Store

```text
ScopeEntry = ⟨scope_id, cleanup, names, vals, states⟩
ScopeId(⟨sid, cleanup, names, vals, states⟩) = sid
ScopeCleanup(⟨sid, cleanup, names, vals, states⟩) = cleanup
ScopeNames(⟨sid, cleanup, names, vals, states⟩) = names
ScopeVals(⟨sid, cleanup, names, vals, states⟩) = vals
ScopeStates(⟨sid, cleanup, names, vals, states⟩) = states
```

```text
ScopeStack(σ) ∈ [ScopeEntry]
CurrentScope(σ) = scope ⇔ ScopeStack(σ) = scope :: ss
CurrentScopeId(σ) = ScopeId(CurrentScope(σ))
ScopeEmpty(sid) = ⟨sid, [], ∅, ∅, ∅⟩
FreshScopeId(σ) = sid ⇒ ∀ s ∈ ScopeStack(σ). ScopeId(s) ≠ sid
```

```text
UpdateScopeStack(σ, ss) = σ' ⇔ ScopeStack(σ') = ss ∧ AddrTags(σ') = AddrTags(σ) ∧ RegionStack(σ') = RegionStack(σ) ∧ RegionArena(σ') = RegionArena(σ) ∧ PoisonedModules(σ') = PoisonedModules(σ)
```

```text
PushScope_σ(σ) ⇓ (σ', scope) ⇔ scope = ScopeEmpty(sid) ∧ FreshScopeId(σ) = sid ∧ UpdateScopeStack(σ, scope :: ScopeStack(σ)) = σ'
PopScope_σ(σ) ⇓ (σ', scope) ⇔ ScopeStack(σ) = scope :: ss ∧ UpdateScopeStack(σ, ss) = σ'
```

```text
AppendCleanup(σ, item) ⇓ σ' ⇔ ScopeStack(σ) = scope :: ss ∧ scope = ⟨sid, cleanup, names, vals, states⟩ ∧ scope' = ⟨sid, cleanup ++ [item], names, vals, states⟩ ∧ UpdateScopeStack(σ, scope' :: ss) = σ'
```

CleanupList(scope) = ScopeCleanup(scope)

```text
ScopeById([], sid) = ⊥
```

ScopeById(scope :: ss, sid) =
  scope                 if ScopeId(scope) = sid
  ScopeById(ss, sid)    otherwise

```text
ReplaceScopeById([], sid, scope') = ⊥
```

ReplaceScopeById(scope :: ss, sid, scope') =
  scope' :: ss                                if ScopeId(scope) = sid
  scope :: ReplaceScopeById(ss, sid, scope')  otherwise

```text
SetCleanupList(scope, xs, σ) ⇓ σ' ⇔ sid = ScopeId(scope) ∧ scope' = ⟨sid, xs, ScopeNames(scope), ScopeVals(scope), ScopeStates(scope)⟩ ∧ ReplaceScopeById(ScopeStack(σ), sid, scope') = ss' ∧ UpdateScopeStack(σ, ss') = σ'
```

```text
PoisonedModule(σ, path) ⇔ ∃ m. PathOfModule(m) = path ∧ ReadAddr(σ, AddrOfSym(PoisonFlag(m))) ≠ 0
```

For hosted-library session execution, §24.4.1 reinterprets the `AddrOfSym(PoisonFlag(m))` occurrence above session-locally for every hosted-state symbol.

```text
PoisonedModules(σ) = {path | PoisonedModule(σ, path)}
```

```text
Binding = ⟨scope_id, bind_id, name⟩
BindingValue = Value ∪ {Alias(addr) | addr ∈ Addr}
```

```text
FreshBindId(σ) = b ⇒ ∀ x. ScopeNames(CurrentScope(σ))[x] defined ⇒ b ∉ ScopeNames(CurrentScope(σ))[x]
```

Last([a]) = a
Last(a :: as) = Last(as)    (|as| > 0)

```text
NearestScope([], x) = ⊥
```

NearestScope(scope :: ss, x) =
  scope                  if ScopeNames(scope)[x] defined
  NearestScope(ss, x)    otherwise

```text
LookupBind(σ, x) = ⟨ScopeId(scope), b, x⟩ ⇔ NearestScope(ScopeStack(σ), x) = scope ∧ b = Last(ScopeNames(scope)[x])
BindingValue(σ, ⟨sid, bind_id, x⟩) = v ⇔ ScopeById(ScopeStack(σ), sid) = scope ∧ ScopeVals(scope)[bind_id] = v
BindState(σ, ⟨sid, bind_id, x⟩) = s ⇔ ScopeById(ScopeStack(σ), sid) = scope ∧ ScopeStates(scope)[bind_id] = s
```

**(LookupVal-Bind-Value)**

```text
LookupBind(σ, x) = b    BindingValue(σ, b) = v
```

───────────────────────────────────────────────

```text
LookupVal(σ, x) = v
```

**(LookupVal-Bind-Alias)**

```text
LookupBind(σ, x) = b    BindingValue(σ, b) = Alias(addr)    ReadAddr(σ, addr) = v
```

───────────────────────────────────────────────────────────────────────────────────────────

```text
LookupVal(σ, x) = v
```

**(LookupVal-Path)**

```text
LookupBind(σ, x) undefined    Γ ⊢ ResolveValueName(x) ⇓ ent    ent.origin_opt = mp    name = (ent.target_opt if present, else x)    ¬ PoisonedModule(σ, PathOfModule(mp))    LookupValPath(σ, PathOfModule(mp), name) = v
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
LookupVal(σ, x) = v
```

**(LookupValPath-Builtin)**

```text
BuiltinValuePath(path, name)    ((path = ["Region"] ∧ name = `new_scoped` ∧ Γ ⊢ BuiltinModalSym(`Region::new_scoped`) ⇓ sym) ∨ (path = ["CancelToken"] ∧ name = `new` ∧ Γ ⊢ BuiltinModalSym(`CancelToken::new`) ⇓ sym))
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
LookupValPath(σ, path, name) = FuncVal(sym)
```

**(LookupValPath-Static)**

```text
Γ ⊢ ResolveQualified(path, name, ValueKind) ⇓ ent    ent.origin_opt = mp    path' = PathOfModule(mp)    name' = (ent.target_opt if present, else name)    ¬ PoisonedModule(σ, path')    StaticAddr(path', name') = addr    ReadAddr(σ, addr) = v
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
LookupValPath(σ, path, name) = v
```

**(LookupValPath-Proc)**

```text
Γ ⊢ ResolveQualified(path, name, ValueKind) ⇓ ent    ent.origin_opt = mp    path' = PathOfModule(mp)    name' = (ent.target_opt if present, else name)    ¬ PoisonedModule(σ, path')    DeclOf(path', name') = proc    Γ ⊢ Mangle(proc) ⇓ sym
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
LookupValPath(σ, path, name) = FuncVal(sym)
```

**(LookupValPath-RecordCtor)**

```text
Γ ⊢ ResolveQualified(path, name, ValueKind) ⇑    Γ ⊢ ResolveRecordPath(path, name) ⇓ p    SplitLast(p) = (mp, _)    ¬ PoisonedModule(σ, mp)
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
LookupValPath(σ, path, name) = RecordCtor(p)
```

```text
ScopeValsUpdate(⟨sid, cleanup, names, vals, states⟩, bind_id, v) = ⟨sid, cleanup, names, vals[bind_id ↦ v], states⟩
ScopeStatesUpdate(⟨sid, cleanup, names, vals, states⟩, bind_id, s) = ⟨sid, cleanup, names, vals, states[bind_id ↦ s]⟩
```

```text
UpdateVal(σ, ⟨sid, bind_id, x⟩, v) ⇓ σ' ⇔ (BindingValue(σ, ⟨sid, bind_id, x⟩) = Alias(addr) ∧ WriteAddr(σ, addr, v) ⇓ σ') ∨ (BindingValue(σ, ⟨sid, bind_id, x⟩) ≠ Alias(_) ∧ ScopeById(ScopeStack(σ), sid) = scope ∧ scope' = ScopeValsUpdate(scope, bind_id, v) ∧ ReplaceScopeById(ScopeStack(σ), sid, scope') = ss' ∧ UpdateScopeStack(σ, ss') = σ')
```

```text
SetState(σ, ⟨sid, bind_id, x⟩, s) ⇓ σ' ⇔ ScopeById(ScopeStack(σ), sid) = scope ∧ scope' = ScopeStatesUpdate(scope, bind_id, s) ∧ ReplaceScopeById(ScopeStack(σ), sid, scope') = ss' ∧ UpdateScopeStack(σ, ss') = σ'
```

```text
TypeOf(⟨sid, bind_id, x⟩) = TypeOf(x)
BindInfo(⟨sid, bind_id, x⟩) = BindInfo(x)
```

```text
BindVal(σ, x, v) ⇓ (σ', b) ⇔ ScopeStack(σ) = scope :: ss ∧ scope = ⟨sid, cleanup, names, vals, states⟩ ∧ bind_id = FreshBindId(σ) ∧ names' = names[x ↦ (names[x] if present else []) ++ [bind_id]] ∧ vals' = vals[bind_id ↦ v] ∧ states' = states[bind_id ↦ `Valid`] ∧ scope' = ⟨sid, cleanup, names', vals', states'⟩ ∧ UpdateScopeStack(σ, scope' :: ss) = σ_1 ∧ b = ⟨sid, bind_id, x⟩ ∧ ((BindInfo(b).resp = resp ∧ AppendCleanup(σ_1, DropBinding(b)) ⇓ σ') ∨ (BindInfo(b).resp ≠ resp ∧ σ' = σ_1))
```

```text
BindPatternVal(p, v) ⇓ B ⇔ Γ ⊢ MatchPattern(p, v) ⇓ B
BindOrder(p, B) = [⟨x, B[x]⟩ | x ∈ PatNames(p)]
```

```text
BindList(σ, []) ⇓ (σ, [])
BindList(σ, [⟨x, v⟩] ++ xs) ⇓ (σ_2, b :: bs) ⇔ BindVal(σ, x, v) ⇓ (σ_1, b) ∧ BindList(σ_1, xs) ⇓ (σ_2, bs)
```

```text
BindPattern(σ, p, v) ⇓ (σ', bs) ⇔ BindPatternVal(p, v) ⇓ B ∧ BindOrder(p, B) = binds ∧ BindList(σ, binds) ⇓ (σ', bs)
```

#### 6.5.2 Region Stack and Arenas

```text
RegionEntry = ⟨tag, target, scope, mark_opt⟩
RegionTagOf(⟨tag, target, scope, mark_opt⟩) = tag
RegionTargetOf(⟨tag, target, scope, mark_opt⟩) = target
RegionScopeOf(⟨tag, target, scope, mark_opt⟩) = scope
RegionMarkOf(⟨tag, target, scope, mark_opt⟩) = mark_opt
```

RuntimeTag = {RegionTag(tag), ScopeTag(sid)}

```text
RegionStack(σ) ∈ [RegionEntry]
AddrTags(σ) : Addr ⇀ RuntimeTag
```

```text
RegionArena(σ) : usize ⇀ [Addr]
ArenaAllocs(σ, r) = allocs ⇔ RegionArena(σ)(r) = allocs
```

```text
UpdateRegionArena(σ, RA) = σ' ⇔ RegionArena(σ') = RA ∧ ScopeStack(σ') = ScopeStack(σ) ∧ AddrTags(σ') = AddrTags(σ) ∧ RegionStack(σ') = RegionStack(σ) ∧ PoisonedModules(σ') = PoisonedModules(σ)
ArenaNew(σ, r) ⇓ σ' ⇔ UpdateRegionArena(σ, RegionArena(σ)[r ↦ []]) = σ'
```

```text
FreshAddr(σ) = addr ⇒ ReadAddr(σ, addr) undefined ∧ AddrTags(σ)(addr) undefined
Prefix([a_0, …, a_{n-1}], m) = [a_0, …, a_{m-1}]    (0 ≤ m ≤ n)
```

```text
ArenaAppend(σ, r, addr) ⇓ σ' ⇔ ArenaAllocs(σ, r) = allocs ∧ UpdateRegionArena(σ, RegionArena(σ)[r ↦ allocs ++ [addr]]) = σ'
ArenaMark(σ, r) = m ⇔ ArenaAllocs(σ, r) = allocs ∧ m = |allocs|
ArenaResetTo(σ, r, m) ⇓ σ' ⇔ ArenaAllocs(σ, r) = allocs ∧ 0 ≤ m ≤ |allocs| ∧ allocs' = Prefix(allocs, m) ∧ UpdateRegionArena(σ, RegionArena(σ)[r ↦ allocs']) = σ'
ArenaClear(σ, r) ⇓ σ' ⇔ ArenaResetTo(σ, r, 0) ⇓ σ'
ArenaRemove(σ, r) ⇓ σ' ⇔ RegionArena(σ') = RegionArena(σ) \ {r} ∧ ScopeStack(σ') = ScopeStack(σ) ∧ AddrTags(σ') = AddrTags(σ) ∧ RegionStack(σ') = RegionStack(σ) ∧ PoisonedModules(σ') = PoisonedModules(σ)
```

```text
RegionValue(S, h) = RecordValue(ModalStateRef([`Region`], S), [⟨`handle`, IntVal("usize", h)⟩])
RegionHandleOf(v) = h ⇔ v = RecordValue(ModalStateRef([`Region`], S), fs) ∧ ⟨`handle`, IntVal("usize", h)⟩ ∈ fs
```

```text
ResolveEntry([], r) = ⊥
```

ResolveEntry(e :: es, r) =
  e                     if RegionTargetOf(e) = r
  ResolveEntry(es, r)   otherwise

```text
ActiveEntry(σ) = e ⇔ RegionStack(σ) = e :: es
ActiveTarget(σ) = target ⇔ ActiveEntry(σ) = e ∧ RegionTargetOf(e) = target
ResolveTarget(σ, r) = target ⇔ ResolveEntry(RegionStack(σ), r) = e ∧ RegionTargetOf(e) = target
ResolveTag(σ, r) = tag ⇔ ResolveEntry(RegionStack(σ), r) = e ∧ RegionTagOf(e) = tag
FreshTag(σ) = tag ⇒ ∀ e ∈ RegionStack(σ). RegionTagOf(e) ≠ tag
FreshArena(σ) = r ⇒ ∀ e ∈ RegionStack(σ). RegionTargetOf(e) ≠ r
```

```text
UpdateRegionStack(σ, rs) = σ' ⇔ RegionStack(σ') = rs ∧ ScopeStack(σ') = ScopeStack(σ) ∧ AddrTags(σ') = AddrTags(σ) ∧ RegionArena(σ') = RegionArena(σ) ∧ PoisonedModules(σ') = PoisonedModules(σ)
```

```text
RegionNew(σ, opts) ⇓ (σ', r, scope) ⇔ PushScope_σ(σ) ⇓ (σ_1, scope) ∧ FreshArena(σ) = r ∧ ArenaNew(σ_1, r) ⇓ σ_2 ∧ UpdateRegionStack(σ_2, ⟨r, r, scope, ⊥⟩ :: RegionStack(σ_2)) = σ'
RegionOpen(σ, opts) ⇓ (σ', r) ⇔ FreshArena(σ) = r ∧ ArenaNew(σ, r) ⇓ σ_1 ∧ UpdateRegionStack(σ_1, ⟨r, r, CurrentScopeId(σ), ⊥⟩ :: RegionStack(σ_1)) = σ'
FrameEnter(σ, r) ⇓ (σ', F, scope, mark) ⇔ PushScope_σ(σ) ⇓ (σ_1, scope) ∧ F = FreshTag(σ) ∧ mark = FrameMark(σ_1, r) ∧ UpdateRegionStack(σ_1, ⟨F, r, scope, mark⟩ :: RegionStack(σ_1)) = σ'
```

```text
BindRegionAlias(σ, ⊥, r) ⇓ σ
BindRegionAlias(σ, x, r) ⇓ σ' ⇔ BindVal(σ, x, RegionValue(`@Active`, r)) ⇓ (σ', b)
```

```text
TagAddr(σ, addr, tag) ⇓ σ' ⇔ AddrTags(σ') = AddrTags(σ)[addr ↦ tag] ∧ ScopeStack(σ') = ScopeStack(σ) ∧ RegionStack(σ') = RegionStack(σ) ∧ RegionArena(σ') = RegionArena(σ) ∧ PoisonedModules(σ') = PoisonedModules(σ)
```

```text
TagAddrFrom(σ, base, addr) ⇓ σ' ⇔ (AddrTag(σ, base) = tag ∧ TagAddr(σ, addr, tag) ⇓ σ') ∨ (AddrTag(σ, base) = ⊥ ∧ σ' = σ)
```

```text
RegionAlloc(σ, r, v) ⇓ (σ', v') ⇔ ResolveTag(σ, r) = tag ∧ FreshAddr(σ) = addr ∧ WriteAddr(σ, addr, v) ⇓ σ_1 ∧ ArenaAppend(σ_1, r, addr) ⇓ σ_2 ∧ TagAddr(σ_2, addr, RegionTag(tag)) ⇓ σ' ∧ ReadAddr(σ', addr) = v'
```

```text
FreshTags(σ, tags) ⇔ Distinct(tags) ∧ ∀ tag ∈ Set(tags). ∀ e ∈ RegionStack(σ). RegionTagOf(e) ≠ tag
```

```text
RetagRegions([], r, tags) = [] ⇔ tags = []
```

RetagRegions(e :: es, r, tags) =

```text
  e' :: RetagRegions(es, r, tags')    if RegionTargetOf(e) = r ∧ tags = tag :: tags' ∧ e' = ⟨tag, RegionTargetOf(e), RegionScopeOf(e), RegionMarkOf(e)⟩
```

  e :: RetagRegions(es, r, tags)      otherwise

```text
RegionReset(σ, r) ⇓ σ' ⇔ ArenaClear(σ, r) ⇓ σ_1 ∧ FreshTags(σ_1, tags) ∧ RetagRegions(RegionStack(σ_1), r, tags) = rs' ∧ UpdateRegionStack(σ_1, rs') = σ'
```

PopRegions([], r) = []
PopRegions(e :: es, r) =
  PopRegions(es, r)    if RegionTargetOf(e) = r
  e :: PopRegions(es, r)    otherwise

```text
RegionFree(σ, r) ⇓ σ' ⇔ ArenaRemove(σ, r) ⇓ σ_1 ∧ PopRegions(RegionStack(σ_1), r) = rs' ∧ UpdateRegionStack(σ_1, rs') = σ'
```

```text
FrameMark(σ, r) = ArenaMark(σ, r)
PopRegionScope([], scope) = ⊥
```

PopRegionScope(e :: es, scope) =
  { es                          if RegionScopeOf(e) = scope
    PopRegionScope(es, scope)   otherwise }

```text
ReleaseArena(σ, r) ⇓ σ' ⇔ RegionFree(σ, r) ⇓ σ'
ResetArena(σ, r, scope, mark) ⇓ σ' ⇔ ArenaResetTo(σ, r, mark) ⇓ σ_1 ∧ PopRegionScope(RegionStack(σ_1), scope) = rs' ∧ UpdateRegionStack(σ_1, rs') = σ'
```

Cleanup, unwinding, initialization, deinitialization, and interpreter entry are defined in Chapter 24. This chapter defines only the dynamic scope-stack, binding-store, and region-runtime machinery those sections consume.

#### 6.5.3 Runtime Value, Block, and Address Helpers

**Region Deallocation Order.**
`RegionRelease` and `FrameReset` MUST execute `CleanupScope` before any `ArenaResetTo` or `ArenaRemove`.
`ArenaResetTo`, `ArenaClear`, and `ArenaRemove` MUST NOT invoke `Drop`; they only reclaim arena storage.

```text
RegionProcJudg = {RegionNewScoped(σ, opts) ⇓ (σ', v), RegionAllocProc(σ, v_r, v) ⇓ (σ', v'), RegionResetProc(σ, v_r) ⇓ (σ', v'), RegionFreezeProc(σ, v_r) ⇓ (σ', v'), RegionThawProc(σ, v_r) ⇓ (σ', v'), RegionFreeProc(σ, v_r) ⇓ (σ', v')}
```

**(Region-New-Scoped)**

```text
RegionOpen(σ, opts) ⇓ (σ', r)    v = RegionValue(`@Active`, r)
```

───────────────────────────────────────────────────────────────────────

```text
RegionNewScoped(σ, opts) ⇓ (σ', v)
```

**(Region-Alloc-Proc)**

```text
RegionHandleOf(v_r) = h    ResolveTarget(σ, h) = r_t    RegionAlloc(σ, r_t, v) ⇓ (σ', v')
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
RegionAllocProc(σ, v_r, v) ⇓ (σ', v')
```

**(Region-Reset-Proc)**

```text
RegionHandleOf(v_r) = h    RegionReset(σ, h) ⇓ σ'    v' = RegionValue(`@Active`, h)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
RegionResetProc(σ, v_r) ⇓ (σ', v')
```

**(Region-Freeze-Proc)**
RegionHandleOf(v_r) = h    v' = RegionValue(`@Frozen`, h)
───────────────────────────────────────────────────────────────

```text
RegionFreezeProc(σ, v_r) ⇓ (σ, v')
```

**(Region-Thaw-Proc)**
RegionHandleOf(v_r) = h    v' = RegionValue(`@Active`, h)
──────────────────────────────────────────────────────────────

```text
RegionThawProc(σ, v_r) ⇓ (σ, v')
```

**(Region-Free-Proc)**

```text
RegionHandleOf(v_r) = h    RegionFree(σ, h) ⇓ σ'    v' = RegionValue(`@Freed`, h)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
RegionFreeProc(σ, v_r) ⇓ (σ', v')
```

```text
BlockEnter(σ, binds) ⇓ (σ', scope) ⇔ PushScope_σ(σ) ⇓ (σ_1, scope) ∧ ∃ bs. BindList(σ_1, binds) ⇓ (σ', bs)
```

```text
BoolVal(b) = b ⇔ b ∈ {true, false}
CharVal(u) = u ⇔ u ∈ UnicodeScalar
```

UnitVal = ()

```text
IntVal(t, x) defined ⇔ t ∈ IntTypes ∧ InRange(x, t)
```

IntValType(IntVal(t, x)) = t
IntValValue(IntVal(t, x)) = x

```text
FloatVal(t, v) defined ⇔ t ∈ FloatTypes ∧ v ∈ FloatValueSet(t)
```

FloatValType(FloatVal(t, v)) = t
FloatValValue(FloatVal(t, v)) = v

```text
PtrVal(s, addr) defined ⇔ s ∈ PtrStateSet
TupleVal = {(v_1, …, v_n) | n ≥ 0}
ArrayVal = {[v_1, …, v_n] | n ≥ 0}
FuncVal(sym) defined ⇔ sym ∈ Symbol
ClosureVal(env_ptr, code_ptr) defined ⇔ (env_ptr = null ∨ env_ptr ∈ Addr) ∧ code_ptr ∈ Symbol
RangeVal = {RangeVal(k, lo_opt, hi_opt) | k ∈ RangeKind}
ModalVal(S, v) = ⟨S, v⟩
```

RecordValue(tr, fs) defined

```text
EnumPayloadVal = {⊥, TuplePayload(vec_v), RecordPayload(vec_f)}
EnumValue(path, payload) defined ⇔ payload ∈ EnumPayloadVal
SliceValue(v, r) defined ⇔ SliceBounds(r, Len(v)) defined
Value = {BoolVal(b) | b ∈ {true, false}} ∪ {CharVal(u) | u ∈ UnicodeScalar} ∪ {UnitVal} ∪ {IntVal(t, x) | IntVal(t, x) defined} ∪ {FloatVal(t, v) | FloatVal(t, v) defined} ∪ {PtrVal(s, addr) | PtrVal(s, addr) defined} ∪ {RawPtr(q, addr)} ∪ TupleVal ∪ ArrayVal ∪ {RecordValue(tr, fs)} ∪ {EnumValue(path, payload)} ∪ RangeVal ∪ {SliceValue(v, r) | SliceValue(v, r) defined} ∪ {ModalVal(S, v)} ∪ {Dyn(Cl, RawPtr(`imm`, addr), T)} ∪ `string@Managed` ∪ `string@View` ∪ `bytes@Managed` ∪ `bytes@View` ∪ {FuncVal(sym)} ∪ {ClosureVal(env_ptr, code_ptr)}
```

```text
TupleValue((v_0, …, v_{n-1}), i) = v_i    (0 ≤ i < n)
TupleUpdate((v_0, …, v_{n-1}), i, v') = (v_0, …, v_{i-1}, v', v_{i+1}, …, v_{n-1})    (0 ≤ i < n)
FieldValue(RecordValue(tr, fs), f) = v ⇔ ⟨f, v⟩ ∈ fs
FieldUpdate(RecordValue(tr, fs), f, v') = RecordValue(tr, fs')    where fs' = [⟨f_i, v_i'⟩ | ⟨f_i, v_i⟩ ∈ fs ∧ v_i' = v' if f_i = f otherwise v_i]
IndexUpdate([v_0, …, v_{n-1}], i, v_e) = [v_0, …, v_{i-1}, v_e, v_{i+1}, …, v_{n-1}]    (0 ≤ i < n)
```

SliceLen([v_0, …, v_{n-1}]) = n
SliceLen(SliceValue(v, r)) = end - start    (SliceBounds(r, Len(v)) = (start, end))
SliceElem(v, i) = IndexValue(v, i)    (IndexValue(v, i) defined)

```text
SliceUpdate(v, start, v_rhs) ⇓ v' ⇔ n = SliceLen(v_rhs) ∧ ∃ v_0, …, v_n. v_0 = v ∧ ∀ i ∈ [0, n-1]. v_{i+1} = IndexUpdate(v_i, start + i, SliceElem(v_rhs, i)) ∧ v' = v_n
```

```text
AddrPrimJudg = {ReadAddr(σ, addr) = v, WriteAddr(σ, addr, v) ⇓ σ', FieldAddr(T, addr, f) = addr', TupleAddr(T, addr, i) = addr', IndexAddr(T_b, addr, i) = addr'}
```

AddrAdd(addr, n) = addr + n

```text
ElemType(T_b) = T ⇔ StripPerm(T_b) = TypeArray(T, _) ∨ StripPerm(T_b) = TypeSlice(T)
FieldAddr(T, addr, f) = AddrAdd(addr, FieldOffset(Fields(R), f))    when StripPerm(T) = TypePath(p) ∧ RecordDecl(p) = R
```

TupleAddr(T, addr, i) = AddrAdd(addr, FieldOffset(TupleFields([T_1, …, T_n]), i))    when StripPerm(T) = TypeTuple([T_1, …, T_n])

```text
IndexLen(σ, addr) = Len(v)    (ReadAddr(σ, addr) = v ∧ Len(v) defined)
```

IndexAddr(T_b, addr, i) = AddrAdd(addr, i × sizeof(ElemType(T_b)))    (ElemType(T_b) defined)

```text
IndexAddr(T_b, addr, v_i) = addr' ⇔ IndexNum(v_i) = i ∧ IndexAddr(T_b, addr, i) = addr'
SliceLenFromAddr(σ, addr) = n ⇔ ReadAddr(σ, addr) = v ∧ SliceLen(v) = n
```

PtrStateSet = {`Valid`, `Null`, `Expired`}
RawQual = {`imm`, `mut`}
PtrAddr(Ptr@Valid(addr)) = addr
PtrAddr(Ptr@Null(addr)) = addr
PtrAddr(Ptr@Expired(addr)) = addr
PtrAddr(RawPtr(q, addr)) = addr

```text
BindAddr(⟨sid, bind_id, x⟩) ∈ Addr
```

AddrOfBind(b) =

```text
  { addr         if BindingValue(σ, b) = Alias(addr)
    BindAddr(b)  if BindingValue(σ, b) ≠ Alias(_) }
AddrOfBind(x) = addr ⇔ ∃ b. LookupBind(σ, x) = b ∧ AddrOfBind(b) = addr
```

```text
AddrTag(σ, addr) =
  { ScopeTag(sid)    if addr = BindAddr(⟨sid, bind_id, x⟩)
    RegionTag(tag)   if AddrTags(σ)(addr) = RegionTag(tag)
    ⊥                otherwise }
TagActive(σ, RegionTag(tag)) ⇔ ∃ e ∈ RegionStack(σ). RegionTagOf(e) = tag
TagActive(σ, ScopeTag(sid)) ⇔ ∃ e ∈ ScopeStack(σ). ScopeId(e) = sid
DynAddrState(σ, addr) =
  { `Valid`    if AddrTag(σ, addr) = ⊥
    `Valid`    if AddrTag(σ, addr) = tag ≠ ⊥ ∧ TagActive(σ, tag)
    `Expired`  if AddrTag(σ, addr) = tag ≠ ⊥ ∧ ¬ TagActive(σ, tag) }
```

### 6.6 Runtime State and Memory Diagnostics

This section owns binding-state, region/frame, provenance, and unsafe-runtime diagnostics consumed by Chapters 6, 16, and 18.

| Code         | Severity | Detection    | Condition                                                            |
| ------------ | -------- | ------------ | -------------------------------------------------------------------- |
| `E-MEM-1206` | Error    | Compile-time | Named region not found for allocation                                |
| `E-MEM-1207` | Error    | Compile-time | `frame` used with no active region in scope                          |
| `E-MEM-1208` | Error    | Compile-time | `r.frame` target is not in `Region@Active` state                     |
| `E-MEM-3001` | Error    | Compile-time | Read or move of a binding in Moved or PartiallyMoved state           |
| `E-MEM-3003` | Error    | Compile-time | Reassignment of immutable binding                                    |
| `E-MEM-3004` | Error    | Compile-time | Partial move from binding without `unique` permission                |
| `E-MEM-3005` | Error    | Compile-time | Explicit call to `drop` method with destructor signature             |
| `E-MEM-3006` | Error    | Compile-time | Attempt to move from immovable binding (`:=`)                        |
| `E-MEM-3007` | Error    | Compile-time | `unique` binding from place expression requires explicit `move`      |
| `E-MEM-3020` | Error    | Compile-time | Value with shorter-lived provenance escapes to longer-lived location |
| `E-MEM-3021` | Error    | Compile-time | Region allocation `^` outside region scope                           |
| `E-MEM-3030` | Error    | Compile-time | Unsafe operation outside block                                       |
