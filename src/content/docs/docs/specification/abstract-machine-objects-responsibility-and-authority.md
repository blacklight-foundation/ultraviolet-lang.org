---
title: "Abstract Machine, Objects, Responsibility, and Authority"
description: "6. Abstract Machine, Objects, Responsibility, and Authority of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>


## 6.1 Authority Model

The language adopts a no ambient authority discipline: observable external effects are possible only through explicit possession and use of capability values.

### 6.1.1 Capability Universe

$$
\mathsf{CapToken}\ =\ \{\mathsf{FileSystem},\ \mathsf{Network},\ \mathsf{HeapAllocator},\ \mathsf{Reactor},\ \mathsf{ExecutionDomain},\ \mathsf{System},\ \mathsf{Time}\}
$$

$$
\mathsf{CapInType}\ :\ \mathsf{Type}\ \to \ \mathcal{P} (\mathsf{CapToken})
$$

$$
\begin{array}{l}
\operatorname{CapInType}(\operatorname{TypePath}([\texttt{Context}]))\ =\ \{\mathsf{FileSystem},\ \mathsf{Network},\ \mathsf{HeapAllocator},\ \mathsf{Reactor},\ \mathsf{ExecutionDomain},\ \mathsf{System},\ \mathsf{Time}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypePath}([\texttt{System}]))\ =\ \{\mathsf{System}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{FileSystem}]))\ =\ \{\mathsf{FileSystem}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{Network}]))\ =\ \{\mathsf{Network}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{HeapAllocator}]))\ =\ \{\mathsf{HeapAllocator}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{Reactor}]))\ =\ \{\mathsf{Reactor}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{ExecutionDomain}]))\ =\ \{\mathsf{ExecutionDomain}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{Time}]))\ =\ \{\mathsf{Time}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{MonotonicTime}]))\ =\ \{\mathsf{Time}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{WallTime}]))\ =\ \{\mathsf{Time}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypePerm}(\_,\ T))\ =\ \operatorname{CapInType}(T) \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeTuple}(\mathsf{Ts}))\ =\ \bigcup \{\operatorname{CapInType}(T)\ \mid \ T\ \in \ \mathsf{Ts}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeArray}(T,\ \_))\ =\ \operatorname{CapInType}(T) \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeSlice}(T))\ =\ \operatorname{CapInType}(T)
\end{array}
$$

CapInType(T) distributes structurally over compound nominal, modal, union, and applied types after alias expansion.

Implementations MAY compute `CapInType` by least fixed-point over nominal and alias expansion. Cycles MUST terminate by memoization or an equivalent visited-node strategy.

### 6.1.2 No Ambient Authority Requirements

**(NAA-1) No implicit capability roots.** A conforming implementation MUST NOT provide any implicit or global binding whose type is capability-bearing under `CapInType`.

**(NAA-2) Context as the sole explicit root carrier.** The only capability roots introduced by the abstract machine at runtime are those contained in `Context` values produced by `ContextInitSigma` in §24.4.5 or by `HostSessionInitSigma` in §24.4.4. A conforming implementation MUST introduce those roots only through the executable entry procedure or a hosted-library session created by the sanctioned hosted-library lifecycle.

**(NAA-3) Effect gating.** Any externally observable effect specified by this document MUST occur only as a consequence of calling:
- a runtime host primitive classified in §6.2, or
- a built-in procedure or method whose receiver is a capability value.

$$
\operatorname{CapReq}(d)\ =\ \bigcup \{\operatorname{CapInType}(T_{i})\ \mid \ T_{i}\ \mathsf{is}\ \mathsf{the}\ \mathsf{type}\ \mathsf{of}\ a\ \mathsf{parameter}\ \mathsf{or}\ \mathsf{receiver}\ \mathsf{of}\ \mathsf{declaration}\ d\}
$$

For every direct call from `d_src` to `d_tgt`, a conforming implementation MUST reject the program unless `CapReq(d_tgt) ⊆ CapReq(d_src)`.

### 6.1.3 Attenuation Requirements

The following operations are attenuation operations:
- `$FileSystem::restrict(root)`
- `$Network::restrict_to_host(host)`
- `$HeapAllocator::with_quota(bytes)`
- `CancelToken@Active::child()`
- `Context::cpu()`
- `Context::gpu()`
- `Context::inline()`
- `$Time::monotonic()`
- `$Time::wall()`
- `$MonotonicTime::coarsen(resolution)`
- `$WallTime::coarsen(resolution)`

A conforming implementation MUST ensure attenuation is monotone: a derived capability MUST NOT grant authority beyond the source capability from which it was derived.

For every attenuation operation `ChildCap = ParentCap~>attenuate(...)`, a conforming implementation MUST enforce all of the following:
- `ChildCap` remains operational only while `ParentCap` remains live.
- Dropping `ChildCap` MUST NOT invalidate or diminish `ParentCap`.
- Dropping `ParentCap` while any derived child capability remains live is ill-formed.
- Any runtime delegation performed by `ChildCap` MUST be routed through `ParentCap` or through an equivalent runtime object that enforces an equal-or-stricter authority subset.

### 6.1.4 Observable Behavior and As-If Rule

$$
\begin{array}{l}
\mathsf{ObservableEffect}\ \in \ \{ \\[0.16em]
\ \operatorname{HostEffect}(\mathsf{proc},\ \mathsf{args}), \\[0.16em]
\ \operatorname{FfiEffect}(\mathsf{proc},\ \mathsf{abi},\ \mathsf{dir}), \\[0.16em]
\ \operatorname{PanicEffect}(\mathsf{kind}), \\[0.16em]
\ \operatorname{DropEffect}(\mathsf{target}), \\[0.16em]
\ \operatorname{KeyEffect}(\mathsf{kind},\ \mathsf{paths}) \\[0.16em]
\}
\end{array}
$$

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

### 6.1.5 Sequence Points

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

### 6.1.6 Unsafe and Foreign Interaction

The no-ambient-authority requirements constrain the safe execution model. `unsafe` operations and the foreign-function interface MAY escape these constraints by design, but capability isolation still applies. See §23.5.

## 6.2 Host Primitives

$$
\begin{array}{l}
\mathsf{FSPrim}\ =\ \{\mathsf{FSOpenRead},\ \mathsf{FSOpenWrite},\ \mathsf{FSOpenAppend},\ \mathsf{FSCreateWrite},\ \mathsf{FSReadFile},\ \mathsf{FSReadBytes},\ \mathsf{FSWriteFile},\ \mathsf{FSWriteStdout},\ \mathsf{FSWriteStderr},\ \mathsf{FSExists},\ \mathsf{FSRemove},\ \mathsf{FSOpenDir},\ \mathsf{FSCreateDir},\ \mathsf{FSEnsureDir},\ \mathsf{FSKind},\ \mathsf{FSRestrict}\} \\[0.16em]
\mathsf{FilePrim}\ =\ \{\mathsf{FileReadAll},\ \mathsf{FileReadAllBytes},\ \mathsf{FileWrite},\ \mathsf{FileFlush},\ \mathsf{FileClose}\} \\[0.16em]
\mathsf{DirPrim}\ =\ \{\mathsf{DirNext},\ \mathsf{DirClose}\} \\[0.16em]
\mathsf{SystemPrim}\ =\ \{\mathsf{SystemGetEnv},\ \mathsf{SystemExit},\ \mathsf{SystemRun}\} \\[0.16em]
\mathsf{NetworkPrim}\ =\ \{\mathsf{NetRestrictHost}\} \\[0.16em]
\mathsf{HeapPrim}\ =\ \{\mathsf{HeapWithQuota},\ \mathsf{HeapAllocRaw},\ \mathsf{HeapDeallocRaw}\} \\[0.16em]
\mathsf{ReactorPrim}\ =\ \{\mathsf{ReactorRun},\ \mathsf{ReactorRegister}\} \\[0.16em]
\mathsf{TimePrim}\ =\ \{\mathsf{TimeMonotonic},\ \mathsf{TimeWall},\ \mathsf{MonotonicTimeNow},\ \mathsf{MonotonicTimeResolution},\ \mathsf{MonotonicTimeElapsed},\ \mathsf{MonotonicTimeCoarsen},\ \mathsf{WallTimeNowUtc},\ \mathsf{WallTimeResolution},\ \mathsf{WallTimeCoarsen}\} \\[0.16em]
\mathsf{CancelPrim}\ =\ \{\mathsf{CancelNew},\ \mathsf{CancelChild},\ \mathsf{CancelDoCancel},\ \mathsf{CancelIsCancelled},\ \mathsf{CancelWaitCancelled}\}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{HostPrim}\ =\ \{\mathsf{ParseTOML},\ \mathsf{ReadBytes},\ \mathsf{WriteFile},\ \mathsf{ResolveTool},\ \mathsf{ResolveRuntimeLib},\ \mathsf{Invoke},\ \mathsf{AssembleIR},\ \mathsf{InvokeLinker},\ \mathsf{InvokeArchiver},\ \mathsf{ArchiveMembers}\}\ \cup \ \mathsf{FSPrim}\ \cup \ \mathsf{FilePrim}\ \cup \ \mathsf{DirPrim}\ \cup \ \mathsf{SystemPrim}\ \cup \ \mathsf{NetworkPrim}\ \cup \ \mathsf{HeapPrim}\ \cup \ \mathsf{ReactorPrim}\ \cup \ \mathsf{TimePrim}\ \cup \ \mathsf{CancelPrim} \\[0.16em]
\mathsf{HostPrimDiag}\ =\ \{\mathsf{ParseTOML},\ \mathsf{ReadBytes},\ \mathsf{WriteFile},\ \mathsf{ResolveTool},\ \mathsf{ResolveRuntimeLib},\ \mathsf{Invoke},\ \mathsf{AssembleIR},\ \mathsf{InvokeLinker},\ \mathsf{InvokeArchiver},\ \mathsf{ArchiveMembers}\} \\[0.16em]
\mathsf{HostPrimRuntime}\ =\ \mathsf{FSPrim}\ \cup \ \mathsf{FilePrim}\ \cup \ \mathsf{DirPrim}\ \cup \ \mathsf{SystemPrim}\ \cup \ \mathsf{NetworkPrim}\ \cup \ \mathsf{HeapPrim}\ \cup \ \mathsf{ReactorPrim}\ \cup \ \mathsf{TimePrim}\ \cup \ \mathsf{CancelPrim}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MapsToDiagOrRuntime}(p)\ \Leftrightarrow \ p\ \in \ \mathsf{HostPrimDiag}\ \cup \ \mathsf{HostPrimRuntime} \\[0.16em]
\operatorname{HostPrimFail}(p)\ \Leftrightarrow \ p\ \in \ \mathsf{HostPrim}\ \land \ \exists \ \mathsf{args}.\ \Gamma \ \vdash \ \operatorname{p}(\mathsf{args})\ \Uparrow 
\end{array}
$$

$$
\operatorname{HostPrimFail}(p)\ \land \ \lnot \ \operatorname{MapsToDiagOrRuntime}(p)\ \Rightarrow \ \operatorname{IllFormed}(p)
$$

### 6.2.1 FileSystem, File, and Directory Primitive Relations

Feature-local runtime behavior for capability-bearing filesystem operations is owned here. The built-in capability and modal declarations in Chapters 13 and 14 define the type surface; this section defines the runtime relations they invoke.

$$
\begin{array}{l}
\mathsf{FSJudg}\ =\ \{\operatorname{FSOpenRead}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{FSOpenWrite}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{FSOpenAppend}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{FSCreateWrite}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{FSReadFile}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{FSReadBytes}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{FSWriteFile}(\mathsf{fs},\ \mathsf{path},\ \mathsf{data})\ \Downarrow \ r,\ \operatorname{FSWriteStdout}(\mathsf{fs},\ \mathsf{data})\ \Downarrow \ r,\ \operatorname{FSWriteStderr}(\mathsf{fs},\ \mathsf{data})\ \Downarrow \ r,\ \operatorname{FSExists}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ b,\ \operatorname{FSRemove}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{FSOpenDir}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{FSCreateDir}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{FSEnsureDir}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{FSKind}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{FSRestrict}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ \mathsf{fs}',\ \operatorname{FileReadAll}(\mathsf{handle})\ \Downarrow \ r,\ \operatorname{FileReadAllBytes}(\mathsf{handle})\ \Downarrow \ r,\ \operatorname{FileWrite}(\mathsf{handle},\ \mathsf{data})\ \Downarrow \ r,\ \operatorname{FileFlush}(\mathsf{handle})\ \Downarrow \ r,\ \operatorname{FileClose}(\mathsf{handle})\ \Downarrow \ \mathsf{ok},\ \operatorname{DirNext}(\mathsf{handle})\ \Downarrow \ r,\ \operatorname{DirClose}(\mathsf{handle})\ \Downarrow \ \mathsf{ok}\} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSOpenRead})\ =\ \texttt{Outcome<File@Read, IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSOpenWrite})\ =\ \texttt{Outcome<File@Write, IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSOpenAppend})\ =\ \texttt{Outcome<File@Append, IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSCreateWrite})\ =\ \texttt{Outcome<File@Write, IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSReadFile})\ =\ \texttt{Outcome<unique string@Managed, IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSReadBytes})\ =\ \texttt{Outcome<unique bytes@Managed, IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSWriteFile})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSWriteStdout})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSWriteStderr})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSExists})\ =\ \texttt{bool} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSRemove})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSOpenDir})\ =\ \texttt{Outcome<DirIter@Open, IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSCreateDir})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSEnsureDir})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSKind})\ =\ \texttt{Outcome<FileKind, IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FSRestrict})\ =\ \texttt{\$FileSystem} \\[0.16em]
\operatorname{FSResType}(\mathsf{FileReadAll})\ =\ \texttt{Outcome<unique string@Managed, IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FileReadAllBytes})\ =\ \texttt{Outcome<unique bytes@Managed, IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FileWrite})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FileFlush})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{FileClose})\ =\ \texttt{ok} \\[0.16em]
\operatorname{FSResType}(\mathsf{DirNext})\ =\ \texttt{Outcome<DirEntry | (), IoError>} \\[0.16em]
\operatorname{FSResType}(\mathsf{DirClose})\ =\ \texttt{ok}
\end{array}
$$

When `FSResType(Op) = Outcome<T, E>`, a primitive relation in this section that
returns a successful payload `v` denotes `Outcome<T, E>@Value{value: v}`.
A primitive relation that returns an `IoError` value `e` denotes
`Outcome<T, IoError>@Error{error: e}`. For `DirNext`, the successful payload
type is `DirEntry | ()`, so exhausted iteration returns the `()` member inside
`Outcome<DirEntry | (), IoError>@Value`.

$$
\begin{array}{l}
\mathsf{Handle}\ =\ \mathbb{N}  \\[0.16em]
\mathsf{Entry}\ \mathbin{::} =\ \operatorname{FileEntry}(\mathsf{bytes})\ \mid \ \operatorname{DirEntry}(\mathsf{names})\ \mid \ \mathsf{OtherEntry} \\[0.16em]
\mathsf{FSState}\ =\ \langle \mathsf{entries},\ \mathsf{handles},\ \mathsf{diriters},\ \mathsf{flushed},\ \mathsf{failmap}\rangle  \\[0.16em]
\operatorname{Entries}(\langle \mathsf{entries},\ \mathsf{handles},\ \mathsf{diriters},\ \mathsf{flushed},\ \mathsf{failmap}\rangle )\ =\ \mathsf{entries} \\[0.16em]
\operatorname{Handles}(\langle \mathsf{entries},\ \mathsf{handles},\ \mathsf{diriters},\ \mathsf{flushed},\ \mathsf{failmap}\rangle )\ =\ \mathsf{handles} \\[0.16em]
\operatorname{DirIters}(\langle \mathsf{entries},\ \mathsf{handles},\ \mathsf{diriters},\ \mathsf{flushed},\ \mathsf{failmap}\rangle )\ =\ \mathsf{diriters} \\[0.16em]
\operatorname{FlushedSet}(\langle \mathsf{entries},\ \mathsf{handles},\ \mathsf{diriters},\ \mathsf{flushed},\ \mathsf{failmap}\rangle )\ =\ \mathsf{flushed} \\[0.16em]
\operatorname{FailMap}(\langle \mathsf{entries},\ \mathsf{handles},\ \mathsf{diriters},\ \mathsf{flushed},\ \mathsf{failmap}\rangle )\ =\ \mathsf{failmap} \\[0.16em]
\operatorname{EntryKind}(\omega ,\ \mathsf{path})\ = \\[0.16em]
\ \texttt{File}\ \mathsf{if}\ \operatorname{Entries}(\omega )[\mathsf{path}]\ =\ \operatorname{FileEntry}(\_) \\[0.16em]
\ \texttt{Dir}\ \mathsf{if}\ \operatorname{Entries}(\omega )[\mathsf{path}]\ =\ \operatorname{DirEntry}(\_) \\[0.16em]
\ \texttt{Other}\ \mathsf{if}\ \operatorname{Entries}(\omega )[\mathsf{path}]\ =\ \mathsf{OtherEntry} \\[0.16em]
\ \texttt{Other}\ \mathsf{otherwise} \\[0.16em]
\operatorname{FileBytes}(\omega ,\ \mathsf{path})\ =\ \mathsf{bytes}\ \Leftrightarrow \ \operatorname{Entries}(\omega )[\mathsf{path}]\ =\ \operatorname{FileEntry}(\mathsf{bytes}) \\[0.16em]
\operatorname{DirNames}(\omega ,\ \mathsf{path})\ =\ \mathsf{names}\ \Leftrightarrow \ \operatorname{Entries}(\omega )[\mathsf{path}]\ =\ \operatorname{DirEntry}(\mathsf{names}) \\[0.16em]
\operatorname{HandleStateOf}(\omega ,\ h)\ = \\[0.16em]
\ \operatorname{Handles}(\omega )[h].\mathsf{state}\ \mathsf{if}\ \operatorname{Handles}(\omega )[h]\ \mathsf{defined} \\[0.16em]
\ \texttt{Closed}\quad \mathsf{otherwise} \\[0.16em]
\operatorname{HandlePos}(\omega ,\ h)\ = \\[0.16em]
\ \operatorname{Handles}(\omega )[h].\mathsf{pos}\ \mathsf{if}\ \operatorname{Handles}(\omega )[h]\ \mathsf{defined} \\[0.16em]
\ 0\quad \mathsf{otherwise} \\[0.16em]
\operatorname{HandleLen}(\omega ,\ h)\ = \\[0.16em]
\ \operatorname{Handles}(\omega )[h].\mathsf{len}\ \mathsf{if}\ \operatorname{Handles}(\omega )[h]\ \mathsf{defined} \\[0.16em]
\ 0\quad \mathsf{otherwise} \\[0.16em]
\operatorname{HandlePath}(\omega ,\ h)\ = \\[0.16em]
\ \operatorname{Handles}(\omega )[h].\mathsf{path}\ \mathsf{if}\ \operatorname{Handles}(\omega )[h]\ \mathsf{defined} \\[0.16em]
\ \texttt{"\textbackslash{}""}\quad \mathsf{otherwise} \\[0.16em]
\operatorname{DirIterFS}(\omega ,\ h)\ = \\[0.16em]
\ \operatorname{DirIters}(\omega )[h].\mathsf{fs}\ \mathsf{if}\ \operatorname{DirIters}(\omega )[h]\ \mathsf{defined} \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{DirIterPath}(\omega ,\ h)\ = \\[0.16em]
\ \operatorname{DirIters}(\omega )[h].\mathsf{path}\ \mathsf{if}\ \operatorname{DirIters}(\omega )[h]\ \mathsf{defined} \\[0.16em]
\ \texttt{"\textbackslash{}""}\quad \mathsf{otherwise} \\[0.16em]
\operatorname{DirIterEntries}(\omega ,\ h)\ = \\[0.16em]
\ \operatorname{DirIters}(\omega )[h].\mathsf{entries}\ \mathsf{if}\ \operatorname{DirIters}(\omega )[h]\ \mathsf{defined} \\[0.16em]
\ []\quad \mathsf{otherwise} \\[0.16em]
\operatorname{DirIterPos}(\omega ,\ h)\ = \\[0.16em]
\ \operatorname{DirIters}(\omega )[h].\mathsf{pos}\ \mathsf{if}\ \operatorname{DirIters}(\omega )[h]\ \mathsf{defined} \\[0.16em]
\ 0\quad \mathsf{otherwise} \\[0.16em]
\operatorname{DirIterOpen}(\omega ,\ h)\ \Leftrightarrow \ \operatorname{DirIters}(\omega )[h]\ \mathsf{defined} \\[0.16em]
\operatorname{Flushed}(\omega ,\ h)\ \Leftrightarrow \ h\ \in \ \operatorname{FlushedSet}(\omega ) \\[0.16em]
\mathsf{FSJudg}\_\omega \ =\ \{\operatorname{FSOpenRead}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSOpenWrite}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSOpenAppend}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSCreateWrite}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSReadFile}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSReadBytes}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSWriteFile}(\mathsf{fs},\ \mathsf{path},\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSWriteStdout}(\mathsf{fs},\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSWriteStderr}(\mathsf{fs},\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSExists}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (b,\ \omega '),\ \operatorname{FSRemove}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSOpenDir}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSCreateDir}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSEnsureDir}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FSKind}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ')\} \\[0.16em]
\mathsf{FileJudg}\_\omega \ =\ \{\operatorname{FileReadAll}(h,\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FileReadAllBytes}(h,\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FileWrite}(h,\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FileFlush}(h,\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FileClose}(h,\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ')\} \\[0.16em]
\mathsf{DirJudg}\_\omega \ =\ \{\operatorname{DirNext}(h,\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{DirClose}(h,\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ')\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FSOpenRead}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSOpenRead}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSOpenWrite}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSOpenWrite}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSOpenAppend}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSOpenAppend}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSCreateWrite}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSCreateWrite}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSReadFile}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSReadFile}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSReadBytes}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSReadBytes}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSWriteFile}(\mathsf{fs},\ \mathsf{path},\ \mathsf{data})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSWriteFile}(\mathsf{fs},\ \mathsf{path},\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSWriteStdout}(\mathsf{fs},\ \mathsf{data})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSWriteStdout}(\mathsf{fs},\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSWriteStderr}(\mathsf{fs},\ \mathsf{data})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSWriteStderr}(\mathsf{fs},\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSExists}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ b\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSExists}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (b,\ \omega ') \\[0.16em]
\operatorname{FSRemove}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSRemove}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSOpenDir}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSOpenDir}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSCreateDir}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSCreateDir}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSEnsureDir}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSEnsureDir}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FSKind}(\mathsf{fs},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FSKind}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FileReadAll}(h)\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FileReadAll}(h,\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FileReadAllBytes}(h)\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FileReadAllBytes}(h,\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FileWrite}(h,\ \mathsf{data})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FileWrite}(h,\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FileFlush}(h)\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FileFlush}(h,\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{FileClose}(h)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{FileClose}(h,\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ') \\[0.16em]
\operatorname{DirNext}(h)\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{DirNext}(h,\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{DirClose}(h)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{DirClose}(h,\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ')
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RestrictPath}(\mathsf{base},\ \mathsf{path})\ =\ p\ \Leftrightarrow \ \lnot \ \operatorname{AbsPath}(\mathsf{path})\ \land \ b\ =\ \operatorname{Canon}(\operatorname{Normalize}(\mathsf{base}))\ \land \ b\ \ne \ \bot \ \land \ p\ =\ \operatorname{Canon}(\operatorname{Normalize}(\operatorname{Join}(b,\ \mathsf{path})))\ \land \ p\ \ne \ \bot \ \land \ \operatorname{prefix}(p,\ b) \\[0.16em]
\operatorname{RestrictPath}(\mathsf{base},\ \mathsf{path})\ =\ \bot \ \Leftrightarrow \ \operatorname{AbsPath}(\mathsf{path})\ \lor \ \operatorname{Canon}(\operatorname{Normalize}(\mathsf{base}))\ =\ \bot \ \lor \ \operatorname{Canon}(\operatorname{Normalize}(\operatorname{Join}(\operatorname{Canon}(\operatorname{Normalize}(\mathsf{base})),\ \mathsf{path})))\ =\ \bot \ \lor \ \lnot \ \operatorname{prefix}(\operatorname{Canon}(\operatorname{Normalize}(\operatorname{Join}(\operatorname{Canon}(\operatorname{Normalize}(\mathsf{base})),\ \mathsf{path}))),\ \operatorname{Canon}(\operatorname{Normalize}(\mathsf{base}))) \\[0.16em]
\mathsf{FSOp}\ =\ \{\mathsf{FSOpenRead},\ \mathsf{FSOpenWrite},\ \mathsf{FSOpenAppend},\ \mathsf{FSCreateWrite},\ \mathsf{FSReadFile},\ \mathsf{FSReadBytes},\ \mathsf{FSWriteFile},\ \mathsf{FSWriteStdout},\ \mathsf{FSWriteStderr},\ \mathsf{FSExists},\ \mathsf{FSRemove},\ \mathsf{FSOpenDir},\ \mathsf{FSCreateDir},\ \mathsf{FSEnsureDir},\ \mathsf{FSKind}\} \\[0.16em]
\operatorname{FSRestrict}(\mathsf{fs},\ \mathsf{base})\ \Downarrow \ \mathsf{fs}'\ \land \ \mathsf{Op}\ \in \ \mathsf{FSOp}\ \land \ \operatorname{RestrictPath}(\mathsf{base},\ p)\ =\ q\ \Rightarrow \ \operatorname{Op}(\mathsf{fs}',\ p)\ =\ \operatorname{Op}(\mathsf{fs},\ q) \\[0.16em]
\operatorname{FSRestrict}(\mathsf{fs},\ \mathsf{base})\ \Downarrow \ \mathsf{fs}'\ \land \ \mathsf{Op}\ \in \ \mathsf{FSOp}\ \land \ \operatorname{RestrictPath}(\mathsf{base},\ p)\ =\ \bot \ \land \ \mathsf{Op}\ \ne \ \mathsf{FSExists}\ \Rightarrow \ \operatorname{Op}(\mathsf{fs}',\ p)\ =\ \mathsf{IoError}\mathbin{::} \mathsf{InvalidPath} \\[0.16em]
\operatorname{FSRestrict}(\mathsf{fs},\ \mathsf{base})\ \Downarrow \ \mathsf{fs}'\ \land \ \operatorname{RestrictPath}(\mathsf{base},\ p)\ =\ \bot \ \Rightarrow \ \operatorname{FSExists}(\mathsf{fs}',\ p)\ =\ \mathsf{false}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{FSPathOp}_{0}\ =\ \{\mathsf{FSOpenRead},\ \mathsf{FSOpenWrite},\ \mathsf{FSOpenAppend},\ \mathsf{FSCreateWrite},\ \mathsf{FSReadFile},\ \mathsf{FSReadBytes},\ \mathsf{FSRemove},\ \mathsf{FSOpenDir},\ \mathsf{FSCreateDir},\ \mathsf{FSEnsureDir},\ \mathsf{FSKind}\} \\[0.16em]
\mathsf{FSPathOp}_{1}\ =\ \{\mathsf{FSWriteFile}\} \\[0.16em]
\mathsf{FSRequiresExisting}\ =\ \{\mathsf{FSOpenRead},\ \mathsf{FSOpenWrite},\ \mathsf{FSOpenAppend},\ \mathsf{FSReadFile},\ \mathsf{FSReadBytes},\ \mathsf{FSOpenDir},\ \mathsf{FSKind},\ \mathsf{FSRemove}\} \\[0.16em]
\operatorname{PathInvalid}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Leftrightarrow \ \operatorname{Canon}(\operatorname{Normalize}(\mathsf{path}))\ =\ \bot  \\[0.16em]
\operatorname{EntryExists}(\omega ,\ \mathsf{path})\ \Leftrightarrow \ \operatorname{Entries}(\omega )[\mathsf{path}]\ \mathsf{defined} \\[0.16em]
\operatorname{PermissionDenied}(\mathsf{fs},\ \mathsf{path},\ \mathsf{Op},\ \omega )\ \Leftrightarrow \ \operatorname{FailMap}(\omega )[\langle \mathsf{Op},\ \mathsf{path}\rangle ]\ =\ \mathsf{IoError}\mathbin{::} \mathsf{PermissionDenied} \\[0.16em]
\operatorname{Busy}(\mathsf{fs},\ \mathsf{path},\ \mathsf{Op},\ \omega )\ \Leftrightarrow \ \operatorname{FailMap}(\omega )[\langle \mathsf{Op},\ \mathsf{path}\rangle ]\ =\ \mathsf{IoError}\mathbin{::} \mathsf{Busy} \\[0.16em]
\operatorname{OtherFailure}(\mathsf{fs},\ \mathsf{path},\ \mathsf{Op},\ \omega )\ \Leftrightarrow \ \operatorname{FailMap}(\omega )[\langle \mathsf{Op},\ \mathsf{path}\rangle ]\ =\ \mathsf{IoError}\mathbin{::} \mathsf{IoFailure}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Op}\ \in \ \mathsf{FSPathOp}_{0}\ \land \ \operatorname{PathInvalid}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Rightarrow \ \operatorname{Op}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{InvalidPath},\ \omega ) \\[0.16em]
\mathsf{Op}\ \in \ \mathsf{FSPathOp}_{1}\ \land \ \operatorname{PathInvalid}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Rightarrow \ \operatorname{Op}(\mathsf{fs},\ \mathsf{path},\ \mathsf{data},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{InvalidPath},\ \omega ) \\[0.16em]
\mathsf{Op}\ \in \ \mathsf{FSRequiresExisting}\ \land \ \lnot \ \operatorname{EntryExists}(\omega ,\ \mathsf{path})\ \Rightarrow \ \operatorname{Op}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{NotFound},\ \omega ) \\[0.16em]
\operatorname{PermissionDenied}(\mathsf{fs},\ \mathsf{path},\ \mathsf{Op},\ \omega )\ \Rightarrow \ \operatorname{Op}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{PermissionDenied},\ \omega ) \\[0.16em]
\mathsf{Op}\ =\ \mathsf{FSCreateWrite}\ \land \ \operatorname{EntryExists}(\omega ,\ \mathsf{path})\ \Rightarrow \ \operatorname{Op}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{AlreadyExists},\ \omega ) \\[0.16em]
\mathsf{Op}\ \in \ \{\mathsf{FSCreateDir},\ \mathsf{FSEnsureDir}\}\ \land \ \operatorname{EntryExists}(\omega ,\ \mathsf{path})\ \land \ \operatorname{EntryKind}(\omega ,\ \mathsf{path})\ \ne \ \texttt{Dir}\ \Rightarrow \ \operatorname{Op}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{AlreadyExists},\ \omega ) \\[0.16em]
\mathsf{Op}\ =\ \mathsf{FSOpenDir}\ \land \ \operatorname{EntryExists}(\omega ,\ \mathsf{path})\ \land \ \operatorname{EntryKind}(\omega ,\ \mathsf{path})\ \ne \ \texttt{Dir}\ \Rightarrow \ \operatorname{Op}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{InvalidPath},\ \omega ) \\[0.16em]
\operatorname{Busy}(\mathsf{fs},\ \mathsf{path},\ \mathsf{Op},\ \omega )\ \Rightarrow \ \operatorname{Op}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{Busy},\ \omega ) \\[0.16em]
\operatorname{OtherFailure}(\mathsf{fs},\ \mathsf{path},\ \mathsf{Op},\ \omega )\ \Rightarrow \ \operatorname{Op}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{IoFailure},\ \omega )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FSReadFile}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ')\ \land \ \operatorname{FSReadBytes}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{bytes},\ \omega '')\ \land \ \lnot \ \operatorname{Utf8Valid}(\mathsf{bytes})\ \Rightarrow \ r\ =\ \mathsf{IoError}\mathbin{::} \mathsf{IoFailure} \\[0.16em]
\operatorname{FileReadAll}(h,\ \omega )\ \Downarrow \ (r,\ \omega ')\ \land \ \operatorname{FileReadAllBytes}(h,\ \omega )\ \Downarrow \ (\mathsf{bytes},\ \omega '')\ \land \ \lnot \ \operatorname{Utf8Valid}(\mathsf{bytes})\ \Rightarrow \ r\ =\ \mathsf{IoError}\mathbin{::} \mathsf{IoFailure}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FSExists}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{true},\ \omega ')\ \Rightarrow \ \operatorname{EntryExists}(\omega ,\ \mathsf{path})\ \land \ \lnot \ \operatorname{PathInvalid}(\mathsf{fs},\ \mathsf{path},\ \omega ) \\[0.16em]
\operatorname{FSExists}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{false},\ \omega ')\ \Rightarrow \ \operatorname{PathInvalid}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \lor \ \lnot \ \operatorname{EntryExists}(\omega ,\ \mathsf{path})
\end{array}
$$

$$
\begin{array}{l}
\mathsf{HandleState}\ =\ \{\texttt{OpenRead},\ \texttt{OpenWrite},\ \texttt{OpenAppend},\ \texttt{Closed}\} \\[0.16em]
\operatorname{HandleOpen}(\omega ,\ h)\ \Leftrightarrow \ \operatorname{HandleStateOf}(\omega ,\ h)\ \ne \ \texttt{Closed} \\[0.16em]
\operatorname{HandleMode}(\omega ,\ h)\ = \\[0.16em]
\ \texttt{Read}\quad \mathsf{if}\ \operatorname{HandleStateOf}(\omega ,\ h)\ =\ \texttt{OpenRead} \\[0.16em]
\ \texttt{Write}\ \mathsf{if}\ \operatorname{HandleStateOf}(\omega ,\ h)\ =\ \texttt{OpenWrite} \\[0.16em]
\ \texttt{Append}\ \mathsf{if}\ \operatorname{HandleStateOf}(\omega ,\ h)\ =\ \texttt{OpenAppend} \\[0.16em]
\operatorname{FileLenAt}(\omega ,\ \mathsf{path})\ = \\[0.16em]
\ \operatorname{ByteLen}(\mathsf{bytes})\ \mathsf{if}\ \operatorname{Entries}(\omega )[\mathsf{path}]\ =\ \operatorname{FileEntry}(\mathsf{bytes}) \\[0.16em]
\ 0\quad \mathsf{otherwise} \\[0.16em]
\operatorname{ByteLen}(\mathsf{data})\ =
\end{array}
$$
 |data|       if data ∈ Bytes
 |Utf8(data)| if data ∈ String
 0            otherwise

$$
\begin{array}{l}
\operatorname{LexBytes}(b_{1},\ b_{2})\ \Leftrightarrow \ (\exists \ k.\ 0\ \le \ k\ <\ \operatorname{min}(\mid b_{1}\mid ,\ \mid b_{2}\mid )\ \land \ (\forall \ i\ <\ k.\ b_{1}[i]\ =\ b_{2}[i])\ \land \ b_{1}[k]\ <\ b_{2}[k])\ \lor \ (\mid b_{1}\mid \ <\ \mid b_{2}\mid \ \land \ \forall \ i\ <\ \mid b_{1}\mid .\ b_{1}[i]\ =\ b_{2}[i]) \\[0.16em]
\operatorname{EntryKey}(\mathsf{name})\ =\ \operatorname{CaseFold}(\operatorname{NFC}(\mathsf{name})) \\[0.16em]
\operatorname{EntryOrder}(a,\ b)\ \Leftrightarrow \ \operatorname{LexBytes}(\operatorname{Utf8}(\operatorname{EntryKey}(a)),\ \operatorname{Utf8}(\operatorname{EntryKey}(b)))\ \lor \ (\operatorname{EntryKey}(a)\ =\ \operatorname{EntryKey}(b)\ \land \ \operatorname{LexBytes}(\operatorname{Utf8}(a),\ \operatorname{Utf8}(b))) \\[0.16em]
\operatorname{DirSnapshot}(\mathsf{fs},\ \mathsf{path},\ \omega )\ = \\[0.16em]
\ [\ \texttt{DirEntry}\{\texttt{path}:\ \operatorname{Join}(\mathsf{path},\ \mathsf{name}),\ \texttt{name}:\ \mathsf{name},\ \texttt{kind}:\ \operatorname{EntryKind}(\omega ,\ \operatorname{Join}(\mathsf{path},\ \mathsf{name}))\}\ \mid \ \mathsf{name}\ \in \ \operatorname{DirNames}(\omega ,\ \mathsf{path})\ \land \ \mathsf{name}\ \ne \ \texttt{"."}\ \land \ \mathsf{name}\ \ne \ \texttt{".."}\ ]\ \mathsf{if}\ \operatorname{Entries}(\omega )[\mathsf{path}]\ =\ \operatorname{DirEntry}(\_) \\[0.16em]
\ []\quad \mathsf{otherwise} \\[0.16em]
\operatorname{DirEntries}(\mathsf{fs},\ \mathsf{path},\ \omega )\ =\ \mathsf{sort}\_\{\lambda \ a,\ b.\ \operatorname{EntryOrder}(a.\mathsf{name},\ b.\mathsf{name})\}(\operatorname{DirSnapshot}(\mathsf{fs},\ \mathsf{path},\ \omega ))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FSOpenRead}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{File@Read}\{\texttt{handle}:\ h\},\ \omega ')\ \Rightarrow \ \operatorname{HandleStateOf}(\omega ',\ h)\ =\ \texttt{OpenRead}\ \land \ \operatorname{HandlePos}(\omega ',\ h)\ =\ 0\ \land \ \operatorname{HandlePath}(\omega ',\ h)\ =\ \mathsf{path}\ \land \ \operatorname{HandleLen}(\omega ',\ h)\ =\ \operatorname{FileLenAt}(\omega ,\ \mathsf{path}) \\[0.16em]
\operatorname{FSOpenWrite}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{File@Write}\{\texttt{handle}:\ h\},\ \omega ')\ \Rightarrow \ \operatorname{HandleStateOf}(\omega ',\ h)\ =\ \texttt{OpenWrite}\ \land \ \operatorname{HandlePos}(\omega ',\ h)\ =\ 0\ \land \ \operatorname{HandlePath}(\omega ',\ h)\ =\ \mathsf{path}\ \land \ \operatorname{HandleLen}(\omega ',\ h)\ =\ \operatorname{FileLenAt}(\omega ,\ \mathsf{path}) \\[0.16em]
\operatorname{FSOpenAppend}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{File@Append}\{\texttt{handle}:\ h\},\ \omega ')\ \Rightarrow \ \operatorname{HandleStateOf}(\omega ',\ h)\ =\ \texttt{OpenAppend}\ \land \ \operatorname{HandlePos}(\omega ',\ h)\ =\ \operatorname{FileLenAt}(\omega ,\ \mathsf{path})\ \land \ \operatorname{HandlePath}(\omega ',\ h)\ =\ \mathsf{path}\ \land \ \operatorname{HandleLen}(\omega ',\ h)\ =\ \operatorname{FileLenAt}(\omega ,\ \mathsf{path}) \\[0.16em]
\operatorname{FSCreateWrite}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{File@Write}\{\texttt{handle}:\ h\},\ \omega ')\ \Rightarrow \ \operatorname{HandleStateOf}(\omega ',\ h)\ =\ \texttt{OpenWrite}\ \land \ \operatorname{HandlePos}(\omega ',\ h)\ =\ 0\ \land \ \operatorname{HandlePath}(\omega ',\ h)\ =\ \mathsf{path}\ \land \ \operatorname{HandleLen}(\omega ',\ h)\ =\ 0
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FSReadFile}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ')\ \Leftrightarrow \ \exists \ h,\ \omega_{1} ,\ \omega_{2} .\ \operatorname{FSOpenRead}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{File@Read}\{\texttt{handle}:\ h\},\ \omega_{1} )\ \land \ \operatorname{FileReadAll}(h,\ \omega_{1} )\ \Downarrow \ (r,\ \omega_{2} )\ \land \ \operatorname{FileClose}(h,\ \omega_{2} )\ \Downarrow \ (\mathsf{ok},\ \omega ') \\[0.16em]
\operatorname{FSReadBytes}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ')\ \Leftrightarrow \ \exists \ h,\ \omega_{1} ,\ \omega_{2} .\ \operatorname{FSOpenRead}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{File@Read}\{\texttt{handle}:\ h\},\ \omega_{1} )\ \land \ \operatorname{FileReadAllBytes}(h,\ \omega_{1} )\ \Downarrow \ (r,\ \omega_{2} )\ \land \ \operatorname{FileClose}(h,\ \omega_{2} )\ \Downarrow \ (\mathsf{ok},\ \omega ')
\end{array}
$$

$$
\begin{array}{l}
\lnot \ \operatorname{HandleOpen}(\omega ,\ h)\ \Rightarrow \ \operatorname{FileReadAll}(h,\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{IoFailure},\ \omega ) \\[0.16em]
\lnot \ \operatorname{HandleOpen}(\omega ,\ h)\ \Rightarrow \ \operatorname{FileReadAllBytes}(h,\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{IoFailure},\ \omega ) \\[0.16em]
\lnot \ \operatorname{HandleOpen}(\omega ,\ h)\ \Rightarrow \ \operatorname{FileWrite}(h,\ \mathsf{data},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{IoFailure},\ \omega ) \\[0.16em]
\lnot \ \operatorname{HandleOpen}(\omega ,\ h)\ \Rightarrow \ \operatorname{FileFlush}(h,\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{IoFailure},\ \omega )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FileReadAll}(h,\ \omega )\ \Downarrow \ (r,\ \omega ')\ \land \ r\ \ne \ \mathsf{IoError}\mathbin{::} \mathsf{IoFailure}\ \Rightarrow \ \operatorname{HandlePos}(\omega ',\ h)\ =\ \operatorname{HandleLen}(\omega ,\ h) \\[0.16em]
\operatorname{FileReadAllBytes}(h,\ \omega )\ \Downarrow \ (r,\ \omega ')\ \land \ r\ \ne \ \mathsf{IoError}\mathbin{::} \mathsf{IoFailure}\ \Rightarrow \ \operatorname{HandlePos}(\omega ',\ h)\ =\ \operatorname{HandleLen}(\omega ,\ h)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FileWrite}(h,\ \mathsf{data},\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ')\ \Rightarrow \ \operatorname{HandleOpen}(\omega ,\ h)\ \land \ (\operatorname{HandleMode}(\omega ,\ h)\ =\ \texttt{Append}\ \Rightarrow \ \operatorname{HandlePos}(\omega ',\ h)\ =\ \operatorname{HandleLen}(\omega ,\ h)\ +\ \operatorname{ByteLen}(\mathsf{data}))\ \land \ (\operatorname{HandleMode}(\omega ,\ h)\ \ne \ \texttt{Append}\ \Rightarrow \ \operatorname{HandlePos}(\omega ',\ h)\ =\ \operatorname{HandlePos}(\omega ,\ h)\ +\ \operatorname{ByteLen}(\mathsf{data})) \\[0.16em]
\operatorname{FileWrite}(h,\ \mathsf{data},\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ')\ \Rightarrow \ \operatorname{HandleLen}(\omega ',\ h)\ =\ \operatorname{max}(\operatorname{HandleLen}(\omega ,\ h),\ \operatorname{HandlePos}(\omega ',\ h))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FileFlush}(h,\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ')\ \Rightarrow \ \operatorname{Flushed}(\omega ',\ h) \\[0.16em]
\operatorname{FileClose}(h,\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ')\ \Rightarrow \ \operatorname{HandleStateOf}(\omega ',\ h)\ =\ \texttt{Closed}
\end{array}
$$

$$
\operatorname{FSOpenDir}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{DirIter@Open}\{\texttt{handle}:\ h\},\ \omega ')\ \Rightarrow \ \operatorname{DirIterOpen}(\omega ',\ h)\ \land \ \operatorname{DirIterFS}(\omega ',\ h)\ =\ \mathsf{fs}\ \land \ \operatorname{DirIterPath}(\omega ',\ h)\ =\ \mathsf{path}\ \land \ \operatorname{DirIterEntries}(\omega ',\ h)\ =\ \operatorname{DirEntries}(\mathsf{fs},\ \mathsf{path},\ \omega )\ \land \ \operatorname{DirIterPos}(\omega ',\ h)\ =\ 0
$$

$$
\begin{array}{l}
\lnot \ \operatorname{DirIterOpen}(\omega ,\ h)\ \Rightarrow \ \operatorname{DirNext}(h,\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{IoFailure},\ \omega ) \\[0.16em]
\operatorname{DirIterOpen}(\omega ,\ h)\ \land \ \operatorname{DirIterPos}(\omega ,\ h)\ =\ i\ \land \ i\ \ge \ \mid \operatorname{DirIterEntries}(\omega ,\ h)\mid \ \Rightarrow \ \operatorname{DirNext}(h,\ \omega )\ \Downarrow \ ((),\ \omega ) \\[0.16em]
\operatorname{DirIterOpen}(\omega ,\ h)\ \land \ \operatorname{DirIterPos}(\omega ,\ h)\ =\ i\ \land \ i\ <\ \mid \operatorname{DirIterEntries}(\omega ,\ h)\mid \ \land \ \mathsf{entry}\ =\ \operatorname{DirIterEntries}(\omega ,\ h)[i]\ \Rightarrow \ \operatorname{DirNext}(h,\ \omega )\ \Downarrow \ (\mathsf{entry},\ \omega_{2} )\ \land \ \operatorname{DirIterPos}(\omega_{2} ,\ h)\ =\ i\ +\ 1
\end{array}
$$

$$
\operatorname{DirClose}(h,\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ')\ \Rightarrow \ \lnot \ \operatorname{DirIterOpen}(\omega ',\ h)
$$

### 6.2.2 System Primitive Relations

$$
\begin{array}{l}
\mathsf{SysState}\ =\ \langle \mathsf{env},\ \mathsf{exit}_{\mathsf{code}\_\mathsf{opt}}\rangle  \\[0.16em]
\operatorname{Env}(\langle \mathsf{env},\ \mathsf{exit}_{\mathsf{code}\_\mathsf{opt}}\rangle )\ =\ \mathsf{env} \\[0.16em]
\operatorname{ExitCode}(\langle \mathsf{env},\ \mathsf{exit}_{\mathsf{code}\_\mathsf{opt}}\rangle )\ =\ \mathsf{exit}_{\mathsf{code}\_\mathsf{opt}} \\[0.16em]
\operatorname{SetExitCode}(\langle \mathsf{env},\ \_\rangle ,\ \mathsf{code})\ =\ \langle \mathsf{env},\ \mathsf{code}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{SystemJudg}\ =\ \{\operatorname{SystemGetEnv}(\mathsf{key})\ \Downarrow \ r,\ \operatorname{SystemExit}(\mathsf{code})\ \Downarrow \ \mathsf{ok},\ \operatorname{SystemRun}(\mathsf{command})\ \Downarrow \ \mathsf{code}\} \\[0.16em]
\mathsf{SystemJudg}_{\mathsf{sys}}\ =\ \{\operatorname{SystemGetEnv}(\mathsf{key},\ \mathsf{sys})\ \Downarrow \ (r,\ \mathsf{sys}'),\ \operatorname{SystemExit}(\mathsf{code},\ \mathsf{sys})\ \Downarrow \ \mathsf{sys}',\ \operatorname{SystemRun}(\mathsf{command},\ \mathsf{sys})\ \Downarrow \ (\mathsf{code},\ \mathsf{sys}')\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SystemGetEnv}(\mathsf{key})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \mathsf{sys},\ \mathsf{sys}'.\ \operatorname{SystemGetEnv}(\mathsf{key},\ \mathsf{sys})\ \Downarrow \ (r,\ \mathsf{sys}') \\[0.16em]
\operatorname{SystemExit}(\mathsf{code})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \exists \ \mathsf{sys},\ \mathsf{sys}'.\ \operatorname{SystemExit}(\mathsf{code},\ \mathsf{sys})\ \Downarrow \ \mathsf{sys}' \\[0.16em]
\operatorname{SystemRun}(\mathsf{command})\ \Downarrow \ \mathsf{code}\ \Leftrightarrow \ \exists \ \mathsf{sys},\ \mathsf{sys}'.\ \operatorname{SystemRun}(\mathsf{command},\ \mathsf{sys})\ \Downarrow \ (\mathsf{code},\ \mathsf{sys}')
\end{array}
$$

$$
\mathsf{EmptyStringVal}\ =\ v\ \Leftrightarrow \ \exists \ \mathsf{lit}.\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{StringLiteral}\ \land \ \operatorname{StringBytes}(\mathsf{lit})\ =\ []\ \land \ \operatorname{LiteralValue}(\mathsf{lit},\ \operatorname{TypeString}(\texttt{@View}))\ =\ v
$$

**(System-GetEnv-Ok)**

$$
\begin{array}{l}
\operatorname{Env}(\mathsf{sys})[\mathsf{key}]\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{SystemGetEnv}(\mathsf{key},\ \mathsf{sys})\ \Downarrow \ (v,\ \mathsf{sys})
\end{array}
$$

**(System-GetEnv-None)**

$$
\begin{array}{l}
\mathsf{key}\ \notin \ \operatorname{dom}(\operatorname{Env}(\mathsf{sys})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{SystemGetEnv}(\mathsf{key},\ \mathsf{sys})\ \Downarrow \ (v,\ \mathsf{sys})\quad \mathsf{EmptyStringVal}\ =\ v
\end{array}
$$

**(System-Exit)**

$$
\begin{array}{l}
\mathsf{sys}'\ =\ \operatorname{SetExitCode}(\mathsf{sys},\ \mathsf{code}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{SystemExit}(\mathsf{code},\ \mathsf{sys})\ \Downarrow \ \mathsf{sys}'
\end{array}
$$

**(System-Run)**

$$
\begin{array}{l}
\operatorname{HostRun}(\mathsf{command})\ \Downarrow \ \mathsf{code} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{SystemRun}(\mathsf{command},\ \mathsf{sys})\ \Downarrow \ (\mathsf{code},\ \mathsf{sys})
\end{array}
$$

### 6.2.3 Time Primitive Relations

$$
\mathsf{TimeJudg}\ =\ \{\operatorname{TimeMonotonic}(v_{\mathsf{time}})\ \Downarrow \ v_{\mathsf{mono}},\ \operatorname{TimeWall}(v_{\mathsf{time}})\ \Downarrow \ v_{\mathsf{wall}},\ \operatorname{MonotonicTimeNow}(v_{\mathsf{mono}})\ \Downarrow \ t,\ \operatorname{MonotonicTimeResolution}(v_{\mathsf{mono}})\ \Downarrow \ d,\ \operatorname{MonotonicTimeElapsed}(v_{\mathsf{mono}},\ \mathsf{start},\ \mathsf{end})\ \Downarrow \ r,\ \operatorname{MonotonicTimeCoarsen}(v_{\mathsf{mono}},\ \mathsf{resolution})\ \Downarrow \ r,\ \operatorname{WallTimeNowUtc}(v_{\mathsf{wall}})\ \Downarrow \ r,\ \operatorname{WallTimeResolution}(v_{\mathsf{wall}})\ \Downarrow \ r,\ \operatorname{WallTimeCoarsen}(v_{\mathsf{wall}},\ \mathsf{resolution})\ \Downarrow \ r\}
$$

$$
\begin{array}{l}
\operatorname{DurationVal}(n)\ =\ \operatorname{RecordValue}(\operatorname{TypePath}([\texttt{"Duration"}]),\ [\langle \texttt{nanoseconds},\ \operatorname{IntVal}(\texttt{"u128"},\ n)\rangle ]) \\[0.16em]
\operatorname{MonotonicInstantVal}(\mathsf{domain},\ \mathsf{ticks})\ =\ \operatorname{RecordValue}(\operatorname{TypePath}([\texttt{"MonotonicInstant"}]),\ [\langle \texttt{domain},\ \operatorname{IntVal}(\texttt{"usize"},\ \mathsf{domain})\rangle ,\ \langle \texttt{ticks},\ \operatorname{IntVal}(\texttt{"u128"},\ \mathsf{ticks})\rangle ]) \\[0.16em]
\operatorname{UtcInstantVal}(n)\ =\ \operatorname{RecordValue}(\operatorname{TypePath}([\texttt{"UtcInstant"}]),\ [\langle \texttt{unix\_nanoseconds},\ \operatorname{IntVal}(\texttt{"i128"},\ n)\rangle ]) \\[0.16em]
\operatorname{TimeErrorVal}(\mathsf{name})\ =\ \operatorname{EnumValue}([\texttt{"TimeError"},\ \mathsf{name}],\ \bot ) \\[0.16em]
\operatorname{TimeOk}(T,\ v)\ =\ \texttt{Outcome<T, TimeError>@Value}\{\texttt{value}:\ v\} \\[0.16em]
\operatorname{TimeErr}(T,\ \mathsf{name})\ =\ \texttt{Outcome<T, TimeError>@Error}\{\texttt{error}:\ \operatorname{TimeErrorVal}(\mathsf{name})\}
\end{array}
$$

`TimeMonotonic` and `TimeWall` are attenuation relations from the process time root. `MonotonicTimeCoarsen` and `WallTimeCoarsen` are attenuation relations from an existing clock capability.

A conforming implementation MUST satisfy all of the following:
1. `TimeMonotonic(v_time) ⇓ v_mono` implies `v_mono` denotes a monotonic-clock capability whose authority is a subset of `v_time`.
2. `TimeWall(v_time) ⇓ v_wall` implies `v_wall` denotes a wall-clock capability whose authority is a subset of `v_time`.
3. `MonotonicTimeNow(v_mono) ⇓ MonotonicInstantVal(domain, ticks)` MUST read a monotonic clock. For two successful reads through capabilities in the same clock domain, if read A happens-before read B, then `ticks_A <= ticks_B`.
4. `MonotonicTimeResolution(v_mono) ⇓ DurationVal(n)` MUST return the advertised monotonic-clock resolution for `v_mono`, with `n > 0`.
5. `MonotonicTimeElapsed(v_mono, start, end) ⇓ TimeOk(TypePath(["Duration"]), DurationVal(n))` only if `start` and `end` are monotonic instants from the clock domain authorized by `v_mono`, `end` does not precede `start`, and the elapsed duration is representable in nanoseconds. Otherwise it MUST return `TimeErr(TypePath(["Duration"]), ClockMismatch)` or `TimeErr(TypePath(["Duration"]), OutOfRange)` without reading wall-clock time.
6. `MonotonicTimeCoarsen(v_mono, resolution) ⇓ TimeOk(TypeDynamic(`MonotonicTime`), v_mono')` only if `resolution` denotes `DurationVal(n)` with `n > 0`; the resulting capability MUST NOT expose timing precision finer than `max(n, resolution(v_mono))`. If `resolution` is zero or not a valid duration value, it MUST return `TimeErr(TypeDynamic(`MonotonicTime`), InvalidResolution)`.
7. `WallTimeNowUtc(v_wall) ⇓ TimeOk(TypePath(["UtcInstant"]), UtcInstantVal(n))` MUST read the host wall clock as UTC nanoseconds relative to the Unix epoch. If the host wall clock is unavailable or the value is not representable, it MUST return `TimeErr(TypePath(["UtcInstant"]), ClockUnavailable)` or `TimeErr(TypePath(["UtcInstant"]), OutOfRange)`.
8. `WallTimeResolution(v_wall) ⇓ TimeOk(TypePath(["Duration"]), DurationVal(n))` MUST return the advertised wall-clock resolution for `v_wall`, with `n > 0`, or a `TimeErr(TypePath(["Duration"]), ClockUnavailable)` value when the host cannot report a wall-clock resolution.
9. `WallTimeCoarsen(v_wall, resolution) ⇓ TimeOk(TypeDynamic(`WallTime`), v_wall')` only if `resolution` denotes `DurationVal(n)` with `n > 0`; the resulting capability MUST NOT expose timing precision finer than `max(n, resolution(v_wall))`. If `resolution` is zero or not a valid duration value, it MUST return `TimeErr(TypeDynamic(`WallTime`), InvalidResolution)`.
10. Coarsened clock capabilities MUST NOT invalidate the source capability, mutate unrelated capability state, or introduce authority outside the source capability.

### 6.2.4 Network Primitive Relations

$$
\mathsf{NetworkJudg}\ =\ \{\operatorname{NetRestrictHost}(v_{\mathsf{net}},\ \mathsf{host})\ \Downarrow \ v_{\mathsf{net}}'\}
$$

`NetRestrictHost` is a runtime host-primitive relation with required semantics.

A conforming implementation MUST satisfy all of the following:
1. `NetRestrictHost(v_net, host) ⇓ v_net'` implies `v_net'` denotes a capability whose network authority is a subset of `v_net`.
2. Any connection, bind, or name-resolution operation performed through `v_net'` MUST be rejected unless its effective host equals `host`.
3. Rejection under rule 2 MUST occur before any externally observable network effect is performed.
4. `NetRestrictHost` MUST NOT invalidate `v_net` and MUST NOT mutate unrelated capability state.

### 6.2.5 Primitive Method Application

$$
\begin{array}{l}
\operatorname{HandleOf}(v)\ =\ h\ \Leftrightarrow \ v\ =\ \texttt{File@Read}\{\texttt{handle}:\ h\}\ \lor \ v\ =\ \texttt{File@Write}\{\texttt{handle}:\ h\}\ \lor \ v\ =\ \texttt{File@Append}\{\texttt{handle}:\ h\} \\[0.16em]
\operatorname{DirHandleOf}(v)\ =\ h\ \Leftrightarrow \ v\ =\ \texttt{DirIter@Open}\{\texttt{handle}:\ h\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MethodName}(\operatorname{MethodDecl}(\_,\ \_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \mathsf{name} \\[0.16em]
\operatorname{MethodName}(\operatorname{ClassMethodDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \mathsf{name} \\[0.16em]
\operatorname{MethodName}(\operatorname{StateMethodDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \mathsf{name} \\[0.16em]
\operatorname{MethodName}(\operatorname{TransitionDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \mathsf{name} \\[0.16em]
\operatorname{MethodOwner}(m)\ =\ \mathsf{owner}\ \Leftrightarrow \ \exists \ T.\ \operatorname{MethodByName}(T,\ \operatorname{MethodName}(m))\ =\ m\ \land \ \mathsf{owner}\ =\ T \\[0.16em]
\operatorname{MethodOwner}(m)\ =\ \operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ (m\ \in \ \operatorname{Methods}(M,\ S)\ \lor \ m\ \in \ \operatorname{Transitions}(M,\ S)) \\[0.16em]
\mathsf{PrimCallJudg}\ =\ \{\operatorname{PrimCall}(\mathsf{Owner},\ \mathsf{name},\ v_{\mathsf{self}},\ \mathsf{args})\ \Downarrow \ \mathsf{out}\}
\end{array}
$$

**(Prim-FS-OpenRead)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSOpenRead}(v_{\mathsf{fs}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{open\_read},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-OpenWrite)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSOpenWrite}(v_{\mathsf{fs}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{open\_write},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-OpenAppend)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSOpenAppend}(v_{\mathsf{fs}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{open\_append},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-CreateWrite)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSCreateWrite}(v_{\mathsf{fs}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{create\_write},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-ReadFile)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSReadFile}(v_{\mathsf{fs}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{read\_file},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-ReadBytes)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSReadBytes}(v_{\mathsf{fs}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{read\_bytes},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-WriteFile)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSWriteFile}(v_{\mathsf{fs}},\ p,\ d)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{write\_file},\ v_{\mathsf{fs}},\ [p,\ d])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-WriteStdout)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSWriteStdout}(v_{\mathsf{fs}},\ d)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{write\_stdout},\ v_{\mathsf{fs}},\ [d])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-WriteStderr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSWriteStderr}(v_{\mathsf{fs}},\ d)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{write\_stderr},\ v_{\mathsf{fs}},\ [d])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-Exists)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSExists}(v_{\mathsf{fs}},\ p)\ \Downarrow \ b \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{exists},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(b)
\end{array}
$$

**(Prim-FS-Remove)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSRemove}(v_{\mathsf{fs}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{remove},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-OpenDir)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSOpenDir}(v_{\mathsf{fs}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{open\_dir},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-CreateDir)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSCreateDir}(v_{\mathsf{fs}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{create\_dir},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-EnsureDir)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSEnsureDir}(v_{\mathsf{fs}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{ensure\_dir},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-Kind)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSKind}(v_{\mathsf{fs}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{kind},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-FS-Restrict)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{FSRestrict}(v_{\mathsf{fs}},\ p)\ \Downarrow \ v_{\mathsf{fs}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{FileSystem},\ \texttt{restrict},\ v_{\mathsf{fs}},\ [p])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{fs}}')
\end{array}
$$

**(Prim-File-ReadAll)**

$$
\begin{array}{l}
\operatorname{HandleOf}(v)\ =\ h\quad \Gamma \ \vdash \ \operatorname{FileReadAll}(h)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{ModalStateRef}([\texttt{"File"}],\ \texttt{@Read}),\ \texttt{read\_all},\ v,\ [])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-File-ReadAllBytes)**

$$
\begin{array}{l}
\operatorname{HandleOf}(v)\ =\ h\quad \Gamma \ \vdash \ \operatorname{FileReadAllBytes}(h)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{ModalStateRef}([\texttt{"File"}],\ \texttt{@Read}),\ \texttt{read\_all\_bytes},\ v,\ [])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-File-Write)**

$$
\begin{array}{l}
\operatorname{HandleOf}(v)\ =\ h\quad \Gamma \ \vdash \ \operatorname{FileWrite}(h,\ d)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{ModalStateRef}([\texttt{"File"}],\ \texttt{@Write}),\ \texttt{write},\ v,\ [d])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-File-Flush)**

$$
\begin{array}{l}
\operatorname{HandleOf}(v)\ =\ h\quad \Gamma \ \vdash \ \operatorname{FileFlush}(h)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{ModalStateRef}([\texttt{"File"}],\ \texttt{@Write}),\ \texttt{flush},\ v,\ [])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-File-Write-Append)**

$$
\begin{array}{l}
\operatorname{HandleOf}(v)\ =\ h\quad \Gamma \ \vdash \ \operatorname{FileWrite}(h,\ d)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{ModalStateRef}([\texttt{"File"}],\ \texttt{@Append}),\ \texttt{write},\ v,\ [d])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-File-Flush-Append)**

$$
\begin{array}{l}
\operatorname{HandleOf}(v)\ =\ h\quad \Gamma \ \vdash \ \operatorname{FileFlush}(h)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{ModalStateRef}([\texttt{"File"}],\ \texttt{@Append}),\ \texttt{flush},\ v,\ [])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-File-Close-Read)**

$$
\begin{array}{l}
\operatorname{HandleOf}(v)\ =\ h\quad \Gamma \ \vdash \ \operatorname{FileClose}(h)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{ModalStateRef}([\texttt{"File"}],\ \texttt{@Read}),\ \texttt{close},\ v,\ [])\ \Downarrow \ \operatorname{Val}(\texttt{File@Closed}\{\})
\end{array}
$$

**(Prim-File-Close-Write)**

$$
\begin{array}{l}
\operatorname{HandleOf}(v)\ =\ h\quad \Gamma \ \vdash \ \operatorname{FileClose}(h)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{ModalStateRef}([\texttt{"File"}],\ \texttt{@Write}),\ \texttt{close},\ v,\ [])\ \Downarrow \ \operatorname{Val}(\texttt{File@Closed}\{\})
\end{array}
$$

**(Prim-File-Close-Append)**

$$
\begin{array}{l}
\operatorname{HandleOf}(v)\ =\ h\quad \Gamma \ \vdash \ \operatorname{FileClose}(h)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{ModalStateRef}([\texttt{"File"}],\ \texttt{@Append}),\ \texttt{close},\ v,\ [])\ \Downarrow \ \operatorname{Val}(\texttt{File@Closed}\{\})
\end{array}
$$

**(Prim-Dir-Next)**

$$
\begin{array}{l}
\operatorname{DirHandleOf}(v)\ =\ h\quad \Gamma \ \vdash \ \operatorname{DirNext}(h)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{ModalStateRef}([\texttt{"DirIter"}],\ \texttt{@Open}),\ \texttt{next},\ v,\ [])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-Dir-Close)**

$$
\begin{array}{l}
\operatorname{DirHandleOf}(v)\ =\ h\quad \Gamma \ \vdash \ \operatorname{DirClose}(h)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{ModalStateRef}([\texttt{"DirIter"}],\ \texttt{@Open}),\ \texttt{close},\ v,\ [])\ \Downarrow \ \operatorname{Val}(\texttt{DirIter@Closed}\{\})
\end{array}
$$

**(Prim-System-GetEnv)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{SystemGetEnv}(k)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{System},\ \texttt{get\_env},\ v_{\mathsf{sys}},\ [k])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-System-ExecutablePath)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{SystemExecutablePath}()\ \Downarrow \ \mathsf{path} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{System},\ \texttt{executable\_path},\ v_{\mathsf{sys}},\ [])\ \Downarrow \ \operatorname{Val}(\mathsf{path})
\end{array}
$$

**(Prim-System-ArgumentCount)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{SystemArgumentCount}()\ \Downarrow \ n \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{System},\ \texttt{argument\_count},\ v_{\mathsf{sys}},\ [])\ \Downarrow \ \operatorname{Val}(n)
\end{array}
$$

**(Prim-System-Argument)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{SystemArgument}(\mathsf{index})\ \Downarrow \ \mathsf{text}\quad \mathsf{index}\ <\ \operatorname{SystemArgumentCount}() \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{System},\ \texttt{argument},\ v_{\mathsf{sys}},\ [\mathsf{index}])\ \Downarrow \ \operatorname{Val}(\mathsf{text})
\end{array}
$$

**(Prim-System-CurrentDirectory)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{SystemCurrentDirectory}()\ \Downarrow \ \mathsf{path} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{System},\ \texttt{current\_directory},\ v_{\mathsf{sys}},\ [])\ \Downarrow \ \operatorname{Val}(\mathsf{path})
\end{array}
$$

**(Prim-System-Exit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{SystemExit}(\mathsf{code})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{System},\ \texttt{exit},\ v_{\mathsf{sys}},\ [\mathsf{code}])\ \Downarrow \ \operatorname{Ctrl}(\mathsf{Abort})
\end{array}
$$

**(Prim-System-Run)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{SystemRun}(\mathsf{command})\ \Downarrow \ \mathsf{code} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{System},\ \texttt{run},\ v_{\mathsf{sys}},\ [\mathsf{command}])\ \Downarrow \ \operatorname{Val}(\mathsf{code})
\end{array}
$$

**(Prim-Time-Monotonic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TimeMonotonic}(v_{\mathsf{time}})\ \Downarrow \ v_{\mathsf{mono}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Time},\ \texttt{monotonic},\ v_{\mathsf{time}},\ [])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{mono}})
\end{array}
$$

**(Prim-Time-Wall)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TimeWall}(v_{\mathsf{time}})\ \Downarrow \ v_{\mathsf{wall}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Time},\ \texttt{wall},\ v_{\mathsf{time}},\ [])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{wall}})
\end{array}
$$

**(Prim-MonotonicTime-Now)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MonotonicTimeNow}(v_{\mathsf{mono}})\ \Downarrow \ t \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{MonotonicTime},\ \texttt{now},\ v_{\mathsf{mono}},\ [])\ \Downarrow \ \operatorname{Val}(t)
\end{array}
$$

**(Prim-MonotonicTime-Resolution)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MonotonicTimeResolution}(v_{\mathsf{mono}})\ \Downarrow \ d \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{MonotonicTime},\ \texttt{resolution},\ v_{\mathsf{mono}},\ [])\ \Downarrow \ \operatorname{Val}(d)
\end{array}
$$

**(Prim-MonotonicTime-Elapsed)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MonotonicTimeElapsed}(v_{\mathsf{mono}},\ \mathsf{start},\ \mathsf{end})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{MonotonicTime},\ \texttt{elapsed},\ v_{\mathsf{mono}},\ [\mathsf{start},\ \mathsf{end}])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-MonotonicTime-Coarsen)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MonotonicTimeCoarsen}(v_{\mathsf{mono}},\ \mathsf{resolution})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{MonotonicTime},\ \texttt{coarsen},\ v_{\mathsf{mono}},\ [\mathsf{resolution}])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-WallTime-NowUtc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WallTimeNowUtc}(v_{\mathsf{wall}})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{WallTime},\ \texttt{now\_utc},\ v_{\mathsf{wall}},\ [])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-WallTime-Resolution)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WallTimeResolution}(v_{\mathsf{wall}})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{WallTime},\ \texttt{resolution},\ v_{\mathsf{wall}},\ [])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-WallTime-Coarsen)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WallTimeCoarsen}(v_{\mathsf{wall}},\ \mathsf{resolution})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{WallTime},\ \texttt{coarsen},\ v_{\mathsf{wall}},\ [\mathsf{resolution}])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-Network-RestrictHost)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{NetRestrictHost}(v_{\mathsf{net}},\ \mathsf{host})\ \Downarrow \ v_{\mathsf{net}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Network},\ \texttt{restrict\_to\_host},\ v_{\mathsf{net}},\ [\mathsf{host}])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{net}}')
\end{array}
$$

When `PrimCall(System, exit, ...)` yields `Ctrl(Abort)`, program execution terminates and the observable exit status is `code`.

## 6.3 Binding and Permission Runtime State

### 6.3.1 Binding State

$$
\mathsf{BindingState}\ \mathbin{::} =\ \mathsf{Valid}\ \mid \ \mathsf{Moved}\ \mid \ \operatorname{PartiallyMoved}(F)\quad (F\ \subseteq \ \mathsf{Name})
$$

$$
\begin{array}{l}
\mathsf{Movability}\ \mathbin{::} =\ \mathsf{mov}\ \mid \ \mathsf{immov} \\[0.16em]
\mathsf{Responsibility}\ \mathbin{::} =\ \mathsf{resp}\ \mid \ \mathsf{alias} \\[0.16em]
\mathsf{Mutability}\ =\ \{\texttt{let},\ \texttt{var}\} \\[0.16em]
\mathsf{BindInfo}\ \mathbin{::} =\ \langle \mathsf{state},\ \mathsf{mov},\ \mathsf{mut},\ \mathsf{resp}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{BindScope}\ =\ \operatorname{Map}(\mathsf{Identifier},\ \mathsf{BindInfo}) \\[0.16em]
\mathfrak{B} \ =\ [\mathsf{BindScope}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PushScope_B}(\mathfrak{B} )\ =\ [\emptyset ]\ \mathbin{++} \ \mathfrak{B}  \\[0.16em]
\operatorname{PopScope_B}([\_]\ \mathbin{++} \ \mathfrak{B} )\ =\ \mathfrak{B} 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Lookup_B}([\sigma ]\ \mathbin{++} \ \mathfrak{B} ',\ x)\ = \\[0.16em]
\ \{\ \sigma [x]\quad \mathsf{if}\ x\ \in \ \operatorname{dom}(\sigma ) \\[0.16em]
\quad \operatorname{Lookup_B}(\mathfrak{B} ',\ x)\quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{Lookup_B}([],\ x)\ =\ \bot 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Update_B}([\sigma ]\ \mathbin{++} \ \mathfrak{B} ',\ x,\ \mathsf{info})\ = \\[0.16em]
\ \{\ [\sigma [x\ \mapsto \ \mathsf{info}]]\ \mathbin{++} \ \mathfrak{B} '\quad \mathsf{if}\ x\ \in \ \operatorname{dom}(\sigma ) \\[0.16em]
\quad [\sigma ]\ \mathbin{++} \ \operatorname{Update_B}(\mathfrak{B} ',\ x,\ \mathsf{info})\ \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{Update_B}([],\ x,\ \mathsf{info})\ =\ \bot 
\end{array}
$$

$$
\operatorname{Intro_B}([\sigma ]\ \mathbin{++} \ \mathfrak{B} ',\ x,\ \mathsf{info})\ =\ [\sigma [x\ \mapsto \ \mathsf{info}]]\ \mathbin{++} \ \mathfrak{B} '
$$

### 6.3.2 Permission Activity State

$$
\begin{array}{l}
\operatorname{PermOf}(\operatorname{TypePerm}(p,\ T))\ =\ p \\[0.16em]
\operatorname{PermOf}(T)\ =\ \texttt{const}\quad \mathsf{if}\ T\ \ne \ \operatorname{TypePerm}(\_,\ \_)
\end{array}
$$

$$
\mathsf{ActiveState}\ \mathbin{::} =\ \mathsf{Active}\ \mid \ \mathsf{Inactive}
$$

$$
\begin{array}{l}
\mathsf{PermKey}\ =\ \mathsf{Identifier}\ \times \ \mathsf{FieldPath} \\[0.16em]
\mathsf{PermScope}\ =\ \operatorname{Map}(\mathsf{PermKey},\ \mathsf{ActiveState}) \\[0.16em]
\Pi \ =\ [\mathsf{PermScope}]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{PushScope}\_\Pi (\Pi )\ =\ [\emptyset ]\ \mathbin{++} \ \Pi  \\[0.16em]
\mathsf{PopScope}\_\Pi ([\_]\ \mathbin{++} \ \Pi )\ =\ \Pi 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Lookup}\_\Pi ([\sigma ]\ \mathbin{++} \ \Pi ',\ k)\ = \\[0.16em]
\ \{\ \mathsf{Inactive}\quad \mathsf{if}\ k\ \in \ \operatorname{dom}(\sigma )\ \land \ \sigma [k]\ =\ \mathsf{Inactive} \\[0.16em]
\quad \mathsf{Lookup}\_\Pi (\Pi ',\ k)\quad \mathsf{otherwise}\ \} \\[0.16em]
\mathsf{Lookup}\_\Pi ([],\ k)\ =\ \mathsf{Active}
\end{array}
$$

$$
\mathsf{Update}\_\Pi ([\sigma ]\ \mathbin{++} \ \Pi ',\ k,\ s)\ =\ [\sigma [k\ \mapsto \ s]]\ \mathbin{++} \ \Pi '
$$

### 6.3.3 Join and Transition Operations

$$
\begin{array}{l}
\operatorname{JoinState}(\mathsf{Moved},\ s)\ =\ \mathsf{Moved} \\[0.16em]
\operatorname{JoinState}(s,\ \mathsf{Moved})\ =\ \mathsf{Moved} \\[0.16em]
\operatorname{JoinState}(\operatorname{PartiallyMoved}(F_{1}),\ \operatorname{PartiallyMoved}(F_{2}))\ =\ \operatorname{PartiallyMoved}(F_{1}\ \cup \ F_{2}) \\[0.16em]
\operatorname{JoinState}(\mathsf{Valid},\ \operatorname{PartiallyMoved}(F))\ =\ \operatorname{PartiallyMoved}(F) \\[0.16em]
\operatorname{JoinState}(\operatorname{PartiallyMoved}(F),\ \mathsf{Valid})\ =\ \operatorname{PartiallyMoved}(F) \\[0.16em]
\operatorname{JoinState}(\mathsf{Valid},\ \mathsf{Valid})\ =\ \mathsf{Valid}
\end{array}
$$

$$
\mathsf{StateTransition}\ =\ \mathsf{Valid}\ \to \ \mathsf{Moved}\ \mid \ \mathsf{Valid}\ \to \ \operatorname{PartiallyMoved}(F)\ \mid \ \operatorname{PartiallyMoved}(F)\ \to \ \operatorname{PartiallyMoved}(F\ \cup \ \{f\})\ \mid \ \operatorname{PartiallyMoved}(F)\ \to \ \mathsf{Moved}
$$

**(Trans-Move-Whole)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \mathsf{Valid},\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle \quad \operatorname{MoveWhole}(x)\ \mathsf{occurs} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \mathsf{Moved},\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle )
\end{array}
$$

**(Trans-Move-Field)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \mathsf{Valid},\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle \quad \operatorname{MoveField}(x,\ f)\ \mathsf{occurs} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \operatorname{PartiallyMoved}(\{f\}),\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle )
\end{array}
$$

**(Trans-Move-Field-Partial)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \operatorname{PartiallyMoved}(F),\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle \quad \operatorname{MoveField}(x,\ f)\ \mathsf{occurs}\quad f\ \notin \ F \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \operatorname{PartiallyMoved}(F\ \cup \ \{f\}),\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle )
\end{array}
$$

**(Trans-Partial-To-Moved)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \operatorname{PartiallyMoved}(F),\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle \quad \operatorname{AllFields}(\operatorname{TypeOf}(x))\ =\ F \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \mathsf{Moved},\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle )
\end{array}
$$

**(Trans-Reassign)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \mathsf{mv},\ \texttt{var},\ \mathsf{resp}\rangle \quad \operatorname{Reassign}(x,\ v)\ \mathsf{occurs}\quad s\ \in \ \{\mathsf{Moved},\ \operatorname{PartiallyMoved}(\_)\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \mathsf{Valid},\ \mathsf{mv},\ \texttt{var},\ \mathsf{resp}\rangle )
\end{array}
$$

**(Trans-Moved-NoAccess)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \mathsf{Moved},\ \_,\ \_,\ \_\rangle \quad \operatorname{Read}(x)\ \lor \ \operatorname{Move}(x)\ \mathsf{occurs} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Uparrow \ \operatorname{Code}(E-\mathsf{MEM}-3001)
\end{array}
$$

**(Trans-Partial-NoAccess)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \operatorname{PartiallyMoved}(F),\ \_,\ \_,\ \_\rangle \quad \operatorname{Read}(x.f)\ \lor \ \operatorname{Move}(x.f)\ \mathsf{occurs}\quad f\ \in \ F \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Uparrow \ \operatorname{Code}(E-\mathsf{MEM}-3001)
\end{array}
$$

**(Trans-Let-NoReassign)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \mathsf{mv},\ \texttt{let},\ \mathsf{resp}\rangle \quad \operatorname{Reassign}(x,\ v)\ \mathsf{occurs}\quad s\ \in \ \{\mathsf{Moved},\ \operatorname{PartiallyMoved}(\_)\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Uparrow \ \operatorname{Code}(E-\mathsf{MEM}-3006)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{JoinBindInfo}(\langle s_{1},\ \mathsf{mv}_{1},\ \mathsf{mut}_{1},\ \mathsf{resp}_{1}\rangle ,\ \langle s_{2},\ \mathsf{mv}_{2},\ \mathsf{mut}_{2},\ \mathsf{resp}_{2}\rangle )\ = \\[0.16em]
\ \{\ \langle \operatorname{JoinState}(s_{1},\ s_{2}),\ \mathsf{mv}_{1},\ \mathsf{mut}_{1},\ \mathsf{resp}_{1}\rangle \ \mathsf{if}\ \mathsf{mv}_{1}\ =\ \mathsf{mv}_{2}\ \land \ \mathsf{mut}_{1}\ =\ \mathsf{mut}_{2}\ \land \ \mathsf{resp}_{1}\ =\ \mathsf{resp}_{2} \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{JoinScope_B}(B_{1},\ B_{2})\ = \\[0.16em]
\ \{\ \{\ x\ \mapsto \ \operatorname{JoinBindInfo}(B_{1}[x],\ B_{2}[x])\ \mid \ x\ \in \ \operatorname{dom}(B_{1})\ \}\quad \mathsf{if}\ \operatorname{dom}(B_{1})\ =\ \operatorname{dom}(B_{2})\ \land \ \forall \ x\ \in \ \operatorname{dom}(B_{1}).\ \operatorname{JoinBindInfo}(B_{1}[x],\ B_{2}[x])\ \ne \ \bot  \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Join_B}([],\ [])\ =\ [] \\[0.16em]
\operatorname{Join_B}(B_{1}\ \mathbin{::} \ \mathfrak{B}_{1} ,\ B_{2}\ \mathbin{::} \ \mathfrak{B}_{2} )\ = \\[0.16em]
\ \{\ \operatorname{JoinScope_B}(B_{1},\ B_{2})\ \mathbin{::} \ \operatorname{Join_B}(\mathfrak{B}_{1} ,\ \mathfrak{B}_{2} )\quad \mathsf{if}\ \operatorname{JoinScope_B}(B_{1},\ B_{2})\ \ne \ \bot \ \land \ \operatorname{Join_B}(\mathfrak{B}_{1} ,\ \mathfrak{B}_{2} )\ \ne \ \bot  \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{Join_B}(\mathfrak{B}_{1} ,\ \mathfrak{B}_{2} )\ =\ \bot \quad \mathsf{if}\ \mid \mathfrak{B}_{1} \mid \ \ne \ \mid \mathfrak{B}_{2} \mid 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{JoinPermState}(\mathsf{Active},\ \mathsf{Active})\ =\ \mathsf{Active} \\[0.16em]
\operatorname{JoinPermState}(\_,\ \_)\ =\ \mathsf{Inactive}\quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PermAt}(B,\ x)\ = \\[0.16em]
\ \{\ B[x]\quad \mathsf{if}\ x\ \in \ \operatorname{dom}(B) \\[0.16em]
\quad \mathsf{Active}\ \mathsf{otherwise}\ \}
\end{array}
$$

$$
\mathsf{JoinScope}\_\Pi (B_{1},\ B_{2})\ =\ \{\ x\ \mapsto \ \operatorname{JoinPermState}(\operatorname{PermAt}(B_{1},\ x),\ \operatorname{PermAt}(B_{2},\ x))\ \mid \ x\ \in \ \operatorname{dom}(B_{1})\ \cup \ \operatorname{dom}(B_{2})\ \}
$$

$$
\begin{array}{l}
\operatorname{JoinPerm}([],\ [])\ =\ [] \\[0.16em]
\operatorname{JoinPerm}(B_{1}\ \mathbin{::} \ \Pi_{1} ,\ B_{2}\ \mathbin{::} \ \Pi_{2} )\ = \\[0.16em]
\ \{\ \mathsf{JoinScope}\_\Pi (B_{1},\ B_{2})\ \mathbin{::} \ \operatorname{JoinPerm}(\Pi_{1} ,\ \Pi_{2} )\quad \mathsf{if}\ \mathsf{JoinScope}\_\Pi (B_{1},\ B_{2})\ \ne \ \bot \ \land \ \operatorname{JoinPerm}(\Pi_{1} ,\ \Pi_{2} )\ \ne \ \bot  \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{JoinPerm}(\Pi_{1} ,\ \Pi_{2} )\ =\ \bot \quad \mathsf{if}\ \mid \Pi_{1} \mid \ \ne \ \mid \Pi_{2} \mid 
\end{array}
$$

### 6.3.4 Access and Binding Introduction Helpers

$$
\begin{array}{l}
\operatorname{FieldHead}(\operatorname{Identifier}(x))\ =\ \bot  \\[0.16em]
\operatorname{FieldHead}(\operatorname{FieldAccess}(p,\ f))\ = \\[0.16em]
\ \{\ f\quad \mathsf{if}\ \operatorname{FieldHead}(p)\ =\ \bot  \\[0.16em]
\quad \operatorname{FieldHead}(p)\quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{FieldHead}(\operatorname{TupleAccess}(p,\ \_))\ =\ \operatorname{FieldHead}(p) \\[0.16em]
\operatorname{FieldHead}(\operatorname{IndexAccess}(p,\ \_))\ =\ \operatorname{FieldHead}(p) \\[0.16em]
\operatorname{FieldHead}(\operatorname{Deref}(p))\ =\ \bot 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{FieldPath}\ =\ [\mathsf{Name}] \\[0.16em]
\operatorname{FieldPathOf}(\operatorname{Identifier}(x))\ =\ [] \\[0.16em]
\operatorname{FieldPathOf}(\operatorname{FieldAccess}(p,\ f))\ =\ \operatorname{FieldPathOf}(p)\ \mathbin{++} \ [f] \\[0.16em]
\operatorname{FieldPathOf}(\operatorname{TupleAccess}(p,\ \_))\ =\ \operatorname{FieldPathOf}(p) \\[0.16em]
\operatorname{FieldPathOf}(\operatorname{IndexAccess}(p,\ \_))\ =\ \operatorname{FieldPathOf}(p) \\[0.16em]
\operatorname{FieldPathOf}(\operatorname{Deref}(p))\ =\ []
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PlacePath}(p)\ = \\[0.16em]
\ \{\ (\operatorname{PlaceRoot}(p),\ [])\quad \mathsf{if}\ p\ =\ \operatorname{Identifier}(x) \\[0.16em]
\quad (\operatorname{PlaceRoot}(p),\ \operatorname{FieldPathOf}(p))\ \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Prefixes}([])\ =\ [[]] \\[0.16em]
\operatorname{Prefixes}([f]\ \mathbin{++} \ \mathsf{fs})\ =\ [[]]\ \cup \ \{\ [f]\ \mathbin{++} \ p\ \mid \ p\ \in \ \operatorname{Prefixes}(\mathsf{fs})\ \} \\[0.16em]
\operatorname{AncPaths}(p)\ =\ \{\ (\operatorname{PlaceRoot}(p),\ \mathsf{fp})\ \mid \ \mathsf{fp}\ \in \ \operatorname{Prefixes}(\operatorname{FieldPathOf}(p))\ \} \\[0.16em]
\operatorname{AccessPathOk}(\Pi ,\ p)\ \Leftrightarrow \ \forall \ k\ \in \ \operatorname{AncPaths}(p).\ \mathsf{Lookup}\_\Pi (\Pi ,\ k)\ =\ \mathsf{Active} \\[0.16em]
\operatorname{SuspendUniquePath}(\Pi ,\ \mathsf{mode},\ p)\ = \\[0.16em]
\ \{\ \operatorname{SetTop}(\Pi ,\ \operatorname{InactivateScope}(\operatorname{Top}(\Pi ),\ \operatorname{AncPaths}(p)))\quad \mathsf{if}\ \mathsf{mode}\ =\ \bot \ \land \ \operatorname{IsPlace}(p)\ \land \ \operatorname{PermOf}(\operatorname{ExprType}(p))\ =\ \texttt{unique} \\[0.16em]
\quad \Pi \quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{SuspendUnique}(\Pi ,\ \mathsf{mode},\ e)\ = \\[0.16em]
\ \{\ \operatorname{SuspendUniquePath}(\Pi ,\ \mathsf{mode},\ e)\quad \mathsf{if}\ \operatorname{IsPlace}(e) \\[0.16em]
\quad \Pi \quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{RemoveKeys}(\sigma ,\ D)\ =\ \{\ k\ \mapsto \ \sigma [k]\ \mid \ k\ \in \ \operatorname{dom}(\sigma )\ \land \ k\ \notin \ D\ \} \\[0.16em]
\operatorname{Reactivate}([\sigma ]\ \mathbin{++} \ \Pi ',\ D)\ =\ [\operatorname{RemoveKeys}(\sigma ,\ D)]\ \mathbin{++} \ \Pi ' \\[0.16em]
\operatorname{ArgPassExpr}(\mathsf{mode},\ \mathsf{moved},\ e)\ = \\[0.16em]
\ \{\ \operatorname{MovedArg}(\mathsf{moved},\ e)\quad \mathsf{if}\ \mathsf{mode}\ =\ \texttt{move}\ \land \ \mathsf{moved}\ =\ \mathsf{true} \\[0.16em]
\quad \operatorname{MovedArg}(\mathsf{true},\ \operatorname{CallTemp}(e))\ \mathsf{if}\ \mathsf{mode}\ =\ \texttt{move}\ \land \ \mathsf{moved}\ =\ \mathsf{false}\ \land \ \lnot \ \operatorname{HasSourceProvenance}(e) \\[0.16em]
\quad \operatorname{RefArgExpr}(e)\quad \mathsf{if}\ \mathsf{mode}\ =\ \bot \ \land \ \mathsf{moved}\ =\ \mathsf{false} \\[0.16em]
\quad e\quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AccessStateOk}(\mathsf{Valid},\ p)\ =\ \mathsf{true} \\[0.16em]
\operatorname{AccessStateOk}(\operatorname{PartiallyMoved}(F),\ p)\ =\ (\operatorname{FieldHead}(p)\ =\ f\ \land \ f\ \notin \ F) \\[0.16em]
\operatorname{AccessStateOk}(\mathsf{Moved},\ p)\ =\ \mathsf{false} \\[0.16em]
\operatorname{PM}(\mathsf{Valid},\ f)\ =\ \operatorname{PartiallyMoved}(\{f\}) \\[0.16em]
\operatorname{PM}(\operatorname{PartiallyMoved}(F),\ f)\ =\ \operatorname{PartiallyMoved}(F\ \cup \ \{f\}) \\[0.16em]
\operatorname{PM}(\mathsf{Moved},\ f)\ =\ \bot 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ExprType}(e)\ =\ T\ \Leftrightarrow \ \Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\operatorname{ExprType}(p)\ =\ T\ \Leftrightarrow \ \operatorname{IsPlace}(p)\ \land \ \Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AccessOk_B}(\mathfrak{B} ,\ p)\ \Leftrightarrow \ x\ =\ \operatorname{PlaceRoot}(p)\ \land \ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \_,\ \_,\ \_\rangle \ \land \ \operatorname{AccessStateOk}(s,\ p) \\[0.16em]
\mathsf{AccessOk}\_\Pi (\Pi ,\ p)\ \Leftrightarrow \ (\operatorname{PermOf}(\operatorname{ExprType}(p))\ \ne \ \texttt{unique})\ \lor \ \operatorname{AccessPathOk}(\Pi ,\ p) \\[0.16em]
\operatorname{AccessOk}(\mathfrak{B} ,\ \Pi ,\ p)\ \Leftrightarrow \ \operatorname{AccessOk_B}(\mathfrak{B} ,\ p)\ \land \ \mathsf{AccessOk}\_\Pi (\Pi ,\ p)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MovOf}(\texttt{"="})\ =\ \mathsf{mov} \\[0.16em]
\operatorname{MovOf}(\texttt{":="})\ =\ \mathsf{immov}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IsMoveExpr}(\operatorname{MoveExpr}(\_))\ =\ \mathsf{true} \\[0.16em]
\operatorname{IsMoveExpr}(\_)\ =\ \mathsf{false}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RespOfInit}(\mathsf{init})\ = \\[0.16em]
\ \{\ \mathsf{resp}\quad \mathsf{if}\ \lnot \ \operatorname{IsPlace}(\mathsf{init}) \\[0.16em]
\quad \mathsf{resp}\quad \mathsf{if}\ \operatorname{IsMoveExpr}(\mathsf{init}) \\[0.16em]
\quad \mathsf{alias}\ \mathsf{otherwise}\ \}
\end{array}
$$

**Temporary Lifetime.**

$$
\operatorname{InitExpr}(\langle \_,\ \_,\ \_,\ \mathsf{init},\ \_\rangle )\ =\ \mathsf{init}
$$

$$
\begin{array}{l}
\operatorname{BindInitScope}(e)\ =\ \operatorname{BindScope}(s)\ \Leftrightarrow  \\[0.16em]
\ (s\ =\ \operatorname{LetStmt}(\mathsf{binding})\ \land \ \operatorname{InitExpr}(\mathsf{binding})\ =\ e)\ \lor  \\[0.16em]
\ (s\ =\ \operatorname{VarStmt}(\mathsf{binding})\ \land \ \operatorname{InitExpr}(\mathsf{binding})\ =\ e)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TempScope}(e)\ = \\[0.16em]
\ \{\ \operatorname{BindInitScope}(e)\quad \mathsf{if}\ \operatorname{BindInitScope}(e)\ \ne \ \bot  \\[0.16em]
\quad \operatorname{StmtScope}(\operatorname{EnclosingStmt}(e))\ \mathsf{otherwise}\ \}
\end{array}
$$

$$
\operatorname{TempValue}(e)\ \Leftrightarrow \ \lnot \ \operatorname{IsPlace}(e)
$$

$$
\begin{array}{l}
\operatorname{TempOrderList}([])\ =\ [] \\[0.16em]
\operatorname{TempOrderList}([e]\ \mathbin{++} \ \mathsf{es})\ =\ \operatorname{TempOrder}(e)\ \mathbin{++} \ \operatorname{TempOrderList}(\mathsf{es})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TempOrder}(e)\ = \\[0.16em]
\ \{\ \operatorname{TempOrderList}(\operatorname{Children_LTR}(e))\ \mathbin{++} \ [e]\quad \mathsf{if}\ \operatorname{TempValue}(e) \\[0.16em]
\quad \operatorname{TempOrderList}(\operatorname{Children_LTR}(e))\quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\operatorname{TempOrderStmt}(s)\ =\ \operatorname{TempOrderList}(\operatorname{StmtExprs}(s))
$$

$$
\begin{array}{l}
\operatorname{ControlExpr}(\operatorname{ReturnStmt}(e))\ =\ e \\[0.16em]
\operatorname{ControlExpr}(\operatorname{BreakStmt}(e))\ =\ e \\[0.16em]
\operatorname{ControlExpr}(s)\ =\ \bot \quad \mathsf{if}\ s\ \notin \ \{\operatorname{ReturnStmt}(\_),\ \operatorname{BreakStmt}(\_)\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TempStmtList}(s)\ =\ [\ e\ \in \ \operatorname{TempOrderStmt}(s)\ \mid \ \operatorname{TempScope}(e)\ =\ \operatorname{StmtScope}(s)\ \land \ e\ \ne \ \operatorname{ControlExpr}(s)\ ] \\[0.16em]
\operatorname{TempDropOrder}(s)\ =\ \operatorname{Rev}(\operatorname{TempStmtList}(s))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{OptList}(\bot )\ =\ [] \\[0.16em]
\operatorname{OptList}(e)\ =\ [e]\quad \mathsf{if}\ e\ \ne \ \bot 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StmtExprs}(\operatorname{LetStmt}(\langle \_,\ \_,\ \_,\ \mathsf{init},\ \_\rangle ))\ =\ [\mathsf{init}] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{VarStmt}(\langle \_,\ \_,\ \_,\ \mathsf{init},\ \_\rangle ))\ =\ [\mathsf{init}] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{UsingLocalStmt}(\_,\ \_,\ \_))\ =\ [] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{AssignStmt}(p,\ e))\ =\ [e,\ p] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{CompoundAssignStmt}(p,\ \_,\ e))\ =\ [p,\ e] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{ExprStmt}(e))\ =\ [e] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{ReturnStmt}(e_{\mathsf{opt}}))\ =\ \operatorname{OptList}(e_{\mathsf{opt}}) \\[0.16em]
\operatorname{StmtExprs}(\operatorname{BreakStmt}(e_{\mathsf{opt}}))\ =\ \operatorname{OptList}(e_{\mathsf{opt}}) \\[0.16em]
\operatorname{StmtExprs}(\mathsf{ContinueStmt})\ =\ [] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{DeferStmt}(\_))\ =\ [] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{UnsafeBlockStmt}(b))\ =\ [b] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \_,\ b))\ =\ [\operatorname{RegionOptsExpr}(\mathsf{opts}_{\mathsf{opt}}),\ b] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{FrameStmt}(\_,\ b))\ =\ [b] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{ErrorStmt}(\_))\ =\ []
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StmtScope}(s)\ =\ s \\[0.16em]
\operatorname{BindScope}(s)\ =\ \operatorname{BlockOfStmt}(s) \\[0.16em]
\operatorname{EnclosingStmt}(e)\ =\ s\ \Leftrightarrow \ e\ \in \ \operatorname{SubExprs}(s)\ \land \ \forall \ s'\ \in \ \operatorname{SubStmts}(s).\ e\ \notin \ \operatorname{SubExprs}(s') \\[0.16em]
\operatorname{BlockOfStmt}(s)\ =\ b\ \Leftrightarrow \ s\ \in \ \operatorname{BlockStmts}(b)\ \land \ \forall \ b'\ \in \ \operatorname{SubBlocks}(b).\ s\ \notin \ \operatorname{BlockStmts}(b')
\end{array}
$$

$$
\operatorname{BlockStmts}(\operatorname{BlockExpr}(\mathsf{stmts},\ \_))\ =\ \mathsf{stmts}
$$

$$
\begin{array}{l}
\operatorname{StmtBlocks}(\operatorname{UnsafeBlockStmt}(b))\ =\ [b] \\[0.16em]
\operatorname{StmtBlocks}(\operatorname{DeferStmt}(b))\ =\ [b] \\[0.16em]
\operatorname{StmtBlocks}(\operatorname{RegionStmt}(\_,\ \_,\ b))\ =\ [b] \\[0.16em]
\operatorname{StmtBlocks}(\operatorname{FrameStmt}(\_,\ b))\ =\ [b] \\[0.16em]
\operatorname{StmtBlocks}(s)\ =\ []\quad \mathsf{if}\ s\ \notin \ \{\operatorname{UnsafeBlockStmt}(\_),\ \operatorname{DeferStmt}(\_),\ \operatorname{RegionStmt}(\_,\ \_,\ \_),\ \operatorname{FrameStmt}(\_,\ \_)\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SubExprs}(s)\ =\ \operatorname{SubExprsList}(\operatorname{StmtExprs}(s)) \\[0.16em]
\operatorname{SubExprsList}([])\ =\ \emptyset  \\[0.16em]
\operatorname{SubExprsList}([e]\ \mathbin{++} \ \mathsf{es})\ =\ \{e\}\ \cup \ \operatorname{SubExprsList}(\operatorname{Children_LTR}(e))\ \cup \ \operatorname{SubExprsList}(\mathsf{es})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SubStmts}(s)\ =\ \operatorname{SubStmtsList}(\operatorname{StmtBlocks}(s)) \\[0.16em]
\operatorname{SubStmtsList}([])\ =\ \emptyset  \\[0.16em]
\operatorname{SubStmtsList}([b]\ \mathbin{++} \ \mathsf{bs})\ =\ \operatorname{BlockStmts}(b)\ \cup \ \operatorname{SubStmtsSeq}(\operatorname{BlockStmts}(b))\ \cup \ \operatorname{SubStmtsList}(\mathsf{bs}) \\[0.16em]
\operatorname{SubStmtsSeq}([])\ =\ \emptyset  \\[0.16em]
\operatorname{SubStmtsSeq}([s]\ \mathbin{++} \ \mathsf{ss})\ =\ \operatorname{SubStmts}(s)\ \cup \ \operatorname{SubStmtsSeq}(\mathsf{ss})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SubBlocks}(b)\ =\ \operatorname{SubBlocksSeq}(\operatorname{BlockStmts}(b)) \\[0.16em]
\operatorname{SubBlocksSeq}([])\ =\ \emptyset  \\[0.16em]
\operatorname{SubBlocksSeq}([s]\ \mathbin{++} \ \mathsf{ss})\ =\ \operatorname{StmtBlocks}(s)\ \cup \ (\bigcup \_\{b'\ \in \ \operatorname{StmtBlocks}(s)\}\ \operatorname{SubBlocks}(b'))\ \cup \ \operatorname{SubBlocksSeq}(\mathsf{ss})
\end{array}
$$

$$
\operatorname{Entries}(B)\ =\ [\langle x_{1},\ B[x_{1}]\rangle ,\ \ldots ,\ \langle x_{n},\ B[x_{n}]\rangle ]\ \Leftrightarrow \ [x_{1},\ \ldots ,\ x_{n}]\ \mathsf{enumerates}\ \operatorname{dom}(B)\ \mathsf{without}\ \mathsf{repetition}
$$

$$
\operatorname{MapUnion}(M_{1},\ M_{2})\ =\ \{\ x\ \mapsto \ (M_{2}[x]\ \mathsf{if}\ x\ \in \ \operatorname{dom}(M_{2})\ \mathsf{else}\ M_{1}[x])\ \mid \ x\ \in \ \operatorname{dom}(M_{1})\ \cup \ \operatorname{dom}(M_{2})\ \}
$$

$$
\operatorname{IntroAll_B}([\sigma ]\ \mathbin{++} \ \mathfrak{B} ',\ B)\ =\ [\operatorname{MapUnion}(\sigma ,\ B)]\ \mathbin{++} \ \mathfrak{B} '
$$

$$
\operatorname{BindInfoMap}(f,\ B,\ \mathsf{mv},\ \mathsf{mut})\ =\ \{\ x\ \mapsto \ \langle \mathsf{Valid},\ \operatorname{MovEff}(\mathsf{mv},\ \operatorname{f}(B[x])),\ \mathsf{mut},\ \operatorname{f}(B[x])\rangle \ \mid \ x\ \in \ \operatorname{dom}(B)\ \}
$$

$$
\begin{array}{l}
\operatorname{MovEff}(\mathsf{mv},\ \mathsf{resp})\ =\ \mathsf{mv} \\[0.16em]
\operatorname{MovEff}(\mathsf{mv},\ \mathsf{alias})\ =\ \mathsf{immov}
\end{array}
$$

$$
\begin{array}{l}
T_{\mathsf{Region}}\ =\ \operatorname{TypeModalState}([\texttt{Region}],\ \texttt{Active}) \\[0.16em]
\operatorname{RegionBindName}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ = \\[0.16em]
\ \{\ \mathsf{alias}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{alias}_{\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\quad \operatorname{FreshRegion}(\Gamma )\quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{RegionBindMap}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ =\ \{\ r\ \mapsto \ T_{\mathsf{Region}}\ \mid \ r\ =\ \operatorname{RegionBindName}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ \} \\[0.16em]
\operatorname{RegionBindInfo}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ =\ \operatorname{BindInfoMap}(\lambda \ U.\ \mathsf{resp},\ \operatorname{RegionBindMap}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}}),\ \mathsf{mov},\ \texttt{let}) \\[0.16em]
\operatorname{FrameBindInfo}(\Gamma )\ =\ \operatorname{RegionBindInfo}(\Gamma ,\ \bot )
\end{array}
$$

$$
\operatorname{Names}(B)\ =\ \operatorname{dom}(B)
$$

$$
\begin{array}{l}
\operatorname{JoinAll_B}([])\ =\ \bot  \\[0.16em]
\operatorname{JoinAll_B}([\mathfrak{B} ])\ =\ \mathfrak{B}  \\[0.16em]
\operatorname{JoinAll_B}(\mathfrak{B}_{1} \ \mathbin{::} \ \mathfrak{B}_{2} \ \mathbin{::} \ \mathsf{rest})\ =\ \operatorname{JoinAll_B}([\operatorname{Join_B}(\mathfrak{B}_{1} ,\ \mathfrak{B}_{2} )]\ \mathbin{++} \ \mathsf{rest})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{JoinAllPerm}([])\ =\ \bot  \\[0.16em]
\operatorname{JoinAllPerm}([\Pi ])\ =\ \Pi  \\[0.16em]
\operatorname{JoinAllPerm}(\Pi_{1} \ \mathbin{::} \ \Pi_{2} \ \mathbin{::} \ \mathsf{rest})\ =\ \operatorname{JoinAllPerm}([\operatorname{JoinPerm}(\Pi_{1} ,\ \Pi_{2} )]\ \mathbin{++} \ \mathsf{rest})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Top}([\sigma ]\ \mathbin{++} \ \Pi ')\ =\ \sigma  \\[0.16em]
\operatorname{SetTop}([\sigma ]\ \mathbin{++} \ \Pi ',\ \sigma ')\ =\ [\sigma ']\ \mathbin{++} \ \Pi ' \\[0.16em]
\operatorname{InactivateScope}(\sigma ,\ K)\ =\ \{\ x\ \mapsto \ (\mathsf{Inactive}\ \mathsf{if}\ x\ \in \ K\ \mathsf{else}\ \sigma [x])\ \mid \ x\ \in \ \operatorname{dom}(\sigma )\ \cup \ K\ \} \\[0.16em]
\operatorname{Roots}(\Pi_{2} ,\ \Pi_{1} )\ =\ \{\ k\ \mid \ \operatorname{Top}(\Pi_{2} )[k]\ =\ \mathsf{Inactive}\ \land \ \mathsf{Lookup}\_\Pi (\Pi_{1} ,\ k)\ =\ \mathsf{Active}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ConsumeOnMove}(\mathfrak{B} ,\ e)\ = \\[0.16em]
\ \{\ \operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \mathsf{Moved},\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle )\quad \mathsf{if}\ \operatorname{IsMoveExpr}(e)\ \land \ x\ =\ \operatorname{PlaceRoot}(\operatorname{MoveInner}(e))\ \land \ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle  \\[0.16em]
\quad \mathfrak{B} \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\operatorname{MoveInner}(\operatorname{MoveExpr}(p))\ =\ p
$$

$$
\mathsf{BJudgment}\ =\ \{\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ e\ \Rightarrow \ \mathfrak{B} '\ \triangleright \ \Pi ',\ \Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ s\ \Rightarrow \ \mathfrak{B} '\ \triangleright \ \Pi '\}
$$

$$
\begin{array}{l}
\operatorname{StaticBindTypesMod}(P,\ m)\ =\ \mathbin{++} \_\{\mathsf{item}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items},\ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_)\}\ \operatorname{StaticBindTypes}(\mathsf{binding}) \\[0.16em]
\operatorname{StaticBindInfo}(\mathsf{item})\ =\ \operatorname{BindInfoMap}(\lambda \ U.\ \operatorname{RespOfInit}(\mathsf{init}),\ \operatorname{StaticBindTypes}(\mathsf{binding}),\ \operatorname{MovOf}(\mathsf{op}),\ \mathsf{mut})\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \mathsf{mut},\ \mathsf{binding},\ \_,\ \_)\ \land \ \mathsf{binding}\ =\ \langle \_,\ \_,\ \mathsf{op},\ \mathsf{init},\ \_\rangle  \\[0.16em]
\operatorname{StaticBindMap}(P,\ m)\ =\ \mathbin{++} \_\{\mathsf{item}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items},\ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)\}\ \operatorname{StaticBindInfo}(\mathsf{item})
\end{array}
$$

**Procedure Entry.**

$$
\begin{array}{l}
\mathfrak{B}_{\mathsf{global}} \ =\ \operatorname{IntroAll_B}(\operatorname{PushScope_B}(\mathfrak{B} ),\ \operatorname{StaticBindMap}(\operatorname{Project}(\Gamma ),\ m)) \\[0.16em]
\mathfrak{B}_{\mathsf{proc}} \ =\ \operatorname{IntroAll_B}(\operatorname{PushScope_B}(\mathfrak{B}_{\mathsf{global}} ),\ \operatorname{ParamBindMap}(\mathsf{params})) \\[0.16em]
\operatorname{ParamBindMap}([])\ =\ \emptyset  \\[0.16em]
\operatorname{ParamBindMap}([\langle \mathsf{mode},\ x,\ T\rangle ]\ \mathbin{++} \ \mathsf{ps})\ =\ \operatorname{MapUnion}(\operatorname{ParamBindMap}(\mathsf{ps}),\ \{\ x\ \mapsto \ \langle \mathsf{Valid},\ \operatorname{ParamMov}(\mathsf{mode}),\ \texttt{let},\ \operatorname{ParamResp}(\mathsf{mode})\rangle \ \}) \\[0.16em]
\operatorname{MethodParamBindMap}(\mathsf{base},\ \mathsf{name})\ =\ \operatorname{ParamBindMap}(\operatorname{RecvParams}(\mathsf{base},\ \mathsf{name})) \\[0.16em]
\operatorname{ParamTypeMap}([])\ =\ \emptyset  \\[0.16em]
\operatorname{ParamTypeMap}([\langle \mathsf{mode},\ x,\ T\rangle ]\ \mathbin{++} \ \mathsf{ps})\ =\ \operatorname{MapUnion}(\operatorname{ParamTypeMap}(\mathsf{ps}),\ \{\ x\ \mapsto \ T\ \}) \\[0.16em]
\operatorname{ParamMov}(\texttt{move})\ =\ \mathsf{mov}\quad \operatorname{ParamMov}(\bot )\ =\ \mathsf{immov} \\[0.16em]
\operatorname{ParamResp}(\texttt{move})\ =\ \mathsf{resp}\quad \operatorname{ParamResp}(\bot )\ =\ \mathsf{alias}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Init_B}(m,\ \mathsf{params})\ =\ \operatorname{IntroAll_B}(\operatorname{PushScope_B}(\operatorname{IntroAll_B}(\operatorname{PushScope_B}([]),\ \operatorname{StaticBindMap}(\operatorname{Project}(\Gamma ),\ m))),\ \operatorname{ParamBindMap}(\mathsf{params})) \\[0.16em]
\mathsf{Init}\_\Pi (m,\ \mathsf{params})\ =\ [\{\ x\ \mapsto \ \mathsf{Active}\ \mid \ (x:T)\ \in \ \operatorname{ParamTypeMap}(\mathsf{params})\ \land \ \operatorname{PermOf}(T)\ =\ \texttt{unique}\ \}]\ \mathbin{++} \ [\{\ x\ \mapsto \ \mathsf{Active}\ \mid \ (x:T)\ \in \ \operatorname{StaticBindTypesMod}(\operatorname{Project}(\Gamma ),\ m)\ \land \ \operatorname{PermOf}(T)\ =\ \texttt{unique}\ \}]
\end{array}
$$

$$
\operatorname{BindCheck}(m,\ \mathsf{params},\ \mathsf{body})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \Gamma ;\ \operatorname{Init_B}(m,\ \mathsf{params});\ \mathsf{Init}\_\Pi (m,\ \mathsf{params})\ \vdash \ \mathsf{body}\ \Rightarrow \ \mathfrak{B} '\ \triangleright \ \Pi '
$$

$$
\operatorname{ProcBindCheck}(m,\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{params},\ \_,\ \_,\ \mathsf{body},\ \_,\ \_))\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \operatorname{BindCheck}(m,\ \mathsf{params},\ \mathsf{body})\ \Downarrow \ \mathsf{ok}
$$

$$
\begin{array}{l}
\operatorname{MethodParamsDecl}(T,\ m)\ =\ [\langle \operatorname{RecvMode}(m.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(T,\ m.\mathsf{receiver})\rangle ]\ \mathbin{++} \ m.\mathsf{params} \\[0.16em]
\operatorname{MethodBindCheck}(m,\ T,\ \mathsf{md})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \mathsf{md}.\mathsf{body}\ =\ \mathsf{body}\ \land \ \operatorname{BindCheck}(m,\ \operatorname{MethodParamsDecl}(T,\ \mathsf{md}),\ \mathsf{body})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\operatorname{ClassMethodBindCheck}(m,\ \mathsf{Cl},\ \mathsf{md})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \mathsf{md}.\mathsf{body}_{\mathsf{opt}}\ =\ \mathsf{body}\ \land \ \operatorname{BindCheck}(m,\ \operatorname{ClassMethodParams}(\mathsf{Cl},\ \mathsf{md}),\ \mathsf{body})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\operatorname{StateMethodBindCheck}(m,\ M,\ S,\ \mathsf{md})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \mathsf{md}.\mathsf{body}\ =\ \mathsf{body}\ \land \ \operatorname{BindCheck}(m,\ \operatorname{StateMethodParams}(M,\ S,\ \mathsf{md}),\ \mathsf{body})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\operatorname{TransitionBindCheck}(m,\ M,\ S,\ \mathsf{tr})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \mathsf{tr}.\mathsf{body}\ =\ \mathsf{body}\ \land \ \operatorname{BindCheck}(m,\ \operatorname{TransitionParams}(M,\ S,\ \mathsf{tr}),\ \mathsf{body})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

$$
\mathsf{BindDiagRefs}\ =\ \{\texttt{"8.2"},\ \texttt{"8.7"},\ \texttt{"8.10"}\}
$$

This chapter defines only the environments and helper operations. Feature-specific `BJudgment` clauses are owned by the consuming chapters.

## 6.4 Regions, Frames, and Provenance

### 6.4.1 Built-In Region Options and Region Helpers

$$
\begin{array}{l}
\mathsf{RegionOptionsFields}\ =\ [ \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{stack\_size},\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{Literal}(\operatorname{IntLiteral}(0)),\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{name},\ \operatorname{TypeString}(\bot ),\ \operatorname{Literal}(\operatorname{StringLiteral}(\texttt{"\textbackslash{}""})),\ \bot ,\ \bot \rangle  \\[0.16em]
]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{RegionOptionsDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{RegionOptions},\ \bot ,\ \bot ,\ [],\ \mathsf{RegionOptionsFields},\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{RegionOptions}]\ =\ \mathsf{RegionOptionsDecl}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RegionPrealloc}(\mathsf{opts})\ =\ \mathsf{opts}.\mathsf{stack}_{\mathsf{size}} \\[0.16em]
\operatorname{NoPrealloc}(\mathsf{opts})\ \Leftrightarrow \ \operatorname{RegionPrealloc}(\mathsf{opts})\ =\ 0
\end{array}
$$

$$
\operatorname{RegionActiveType}(T)\ \Leftrightarrow \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}([\texttt{Region}],\ \texttt{Active})
$$

$$
\operatorname{FreshRegion}(\Gamma )\ \in \ \mathsf{Name}\ \setminus \ \operatorname{dom}(\Gamma )
$$

$$
\begin{array}{l}
\operatorname{RegionOptsExpr}(\bot )\ =\ \operatorname{Call}(\operatorname{Identifier}(\texttt{RegionOptions}),\ []) \\[0.16em]
\operatorname{RegionOptsExpr}(e)\ =\ e\quad \mathsf{if}\ e\ \ne \ \bot 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RegionBind}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ =\ \Gamma_{r} \ \Leftrightarrow \ r\ = \\[0.16em]
\ \{\ \mathsf{alias}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{alias}_{\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\quad \operatorname{FreshRegion}(\Gamma )\quad \mathsf{otherwise}\ \}\ \land \ \operatorname{IntroAll}(\Gamma ,\ [\langle r,\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{Region}],\ \texttt{Active}))\rangle ])\ \Downarrow \ \Gamma_{r} 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{InnermostActiveRegion}([])\ =\ \bot  \\[0.16em]
\operatorname{InnermostActiveRegion}([\sigma ]\ \mathbin{++} \ \Gamma ')\ = \\[0.16em]
\ \{\ r\quad \mathsf{if}\ \exists \ r.\ r\ \in \ \operatorname{dom}(\sigma )\ \land \ \operatorname{RegionActiveType}(\sigma [r]) \\[0.16em]
\quad \operatorname{InnermostActiveRegion}(\Gamma ')\ \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FrameBind}(\Gamma ,\ \mathsf{target}_{\mathsf{opt}})\ =\ \Gamma_{f} \ \Leftrightarrow \ r\ = \\[0.16em]
\ \{\ \operatorname{InnermostActiveRegion}(\Gamma )\quad \mathsf{if}\ \mathsf{target}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\quad \mathsf{target}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{target}_{\mathsf{opt}}\ \ne \ \bot \ \land \ \Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(\mathsf{target}_{\mathsf{opt}})\ :\ T_{r}\ \land \ \operatorname{RegionActiveType}(T_{r})\ \}\ \land \ F\ =\ \operatorname{FreshRegion}(\Gamma )\ \land \ \operatorname{IntroAll}(\Gamma ,\ [\langle F,\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{Region}],\ \texttt{Active}))\rangle ])\ \Downarrow \ \Gamma_{f} 
\end{array}
$$

If `alias_opt = ⊥`, the identifier introduced by `RegionBindName(Γ, alias_opt)` MUST be treated as synthetic. It MUST NOT be introduced by name resolution and MUST NOT be referenced by user code.

`FrameBind` introduces a fresh synthetic region identifier `F` with the same restriction. `F` is used only for provenance assignment.

### 6.4.2 Provenance Tags and Lifetime Order

$$
\pi \ \mathbin{::} =\ \pi_{\mathsf{Global}} \ \mid \ \pi_{\mathsf{Stack}} (S)\ \mid \ \pi_{\mathsf{Heap}} \ \mid \ \pi_{\mathsf{Region}} (r)\ \mid \ \bot 
$$

$$
\operatorname{RegionNesting}(r_{\mathsf{inner}},\ r_{\mathsf{outer}})\ \Leftrightarrow \ \exists \ \Gamma_{1} ,\ \sigma_{\mathsf{inner}} ,\ \Gamma_{2} ,\ \sigma_{\mathsf{outer}} ,\ \Gamma_{3} .\ \Gamma \ =\ \Gamma_{1} \ \mathbin{++} \ [\sigma_{\mathsf{inner}} ]\ \mathbin{++} \ \Gamma_{2} \ \mathbin{++} \ [\sigma_{\mathsf{outer}} ]\ \mathbin{++} \ \Gamma_{3} \ \land \ r_{\mathsf{inner}}\ \in \ \operatorname{dom}(\sigma_{\mathsf{inner}} )\ \land \ r_{\mathsf{outer}}\ \in \ \operatorname{dom}(\sigma_{\mathsf{outer}} )
$$

$$
\pi_{1} \ <\ \pi_{2} \ \Leftrightarrow \ (\pi_{1} \ =\ \pi_{\mathsf{Region}} (r_{\mathsf{inner}})\ \land \ \pi_{2} \ =\ \pi_{\mathsf{Region}} (r_{\mathsf{outer}})\ \land \ \operatorname{RegionNesting}(r_{\mathsf{inner}},\ r_{\mathsf{outer}}))\ \lor \ (\pi_{1} \ =\ \pi_{\mathsf{Region}} (r)\ \land \ \pi_{2} \ =\ \pi_{\mathsf{Stack}} (S))\ \lor \ (\pi_{1} \ =\ \pi_{\mathsf{Stack}} (S)\ \land \ \pi_{2} \ =\ \pi_{\mathsf{Heap}} )\ \lor \ (\pi_{1} \ =\ \pi_{\mathsf{Heap}} \ \land \ \pi_{2} \ =\ \pi_{\mathsf{Global}} )\ \lor \ (\pi_{1} \ =\ \pi_{\mathsf{Global}} \ \land \ \pi_{2} \ =\ \bot )
$$

$$
\pi_{1} \ \le \ \pi_{2} \ \Leftrightarrow \ \pi_{1} \ =\ \pi_{2} \ \lor \ (\pi_{1} \ <\ \pi_{2} )\ \lor \ \exists \ \pi .\ (\pi_{1} \ <\ \pi \ \land \ \pi \ \le \ \pi_{2} )
$$

$$
\begin{array}{l}
\operatorname{FrameTarget}(\Gamma ,\ \bot )\ =\ r\ \Leftrightarrow \ \operatorname{InnermostActiveRegion}(\Gamma )\ =\ r \\[0.16em]
\operatorname{FrameTarget}(\Gamma ,\ r)\ =\ r\ \Leftrightarrow \ \Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(r)\ :\ T_{r}\ \land \ \operatorname{RegionActiveType}(T_{r})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FrameTargetRel}(F,\ r)\ \Leftrightarrow \ \operatorname{FrameTarget}(\Gamma ,\ F)\ =\ r \\[0.16em]
\operatorname{FrameTargetRel}(F,\ r)\ \Rightarrow \ \pi_{\mathsf{Region}} (F)\ <\ \pi_{\mathsf{Region}} (r)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{JoinProv}(\pi_{1} ,\ \pi_{2} )\ = \\[0.16em]
\ \{\ \pi_{1} \quad \mathsf{if}\ \pi_{1} \ \le \ \pi_{2}  \\[0.16em]
\quad \pi_{2} \quad \mathsf{if}\ \pi_{2} \ \le \ \pi_{1}  \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{JoinAllProv}([])\ =\ \bot  \\[0.16em]
\operatorname{JoinAllProv}([\pi ])\ =\ \pi  \\[0.16em]
\operatorname{JoinAllProv}([\pi_{1} ,\ \pi_{2} ]\ \mathbin{++} \ \mathsf{ps})\ =\ \operatorname{JoinAllProv}([\operatorname{JoinProv}(\pi_{1} ,\ \pi_{2} )]\ \mathbin{++} \ \mathsf{ps})
\end{array}
$$

### 6.4.3 Provenance Environment

$$
\begin{array}{l}
\Omega \ =\ \langle \Sigma \_\pi ,\ \mathsf{RS}\rangle  \\[0.16em]
\mathsf{Scope}\_\pi \ =\ \langle S,\ M\rangle \ \mathsf{where}\ M\ :\ \mathsf{Ident}\ \rightharpoonup \ \pi  \\[0.16em]
\Sigma \_\pi \ \in \ [\mathsf{Scope}\_\pi ] \\[0.16em]
\mathsf{RegionEntry}\_\pi \ =\ \langle \mathsf{tag},\ \mathsf{target}\rangle  \\[0.16em]
\mathsf{RS}\ \in \ [\mathsf{RegionEntry}\_\pi ]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ScopeId}(\langle S,\ M\rangle )\ =\ S \\[0.16em]
\operatorname{ScopeMap}(\langle S,\ M\rangle )\ =\ M \\[0.16em]
\operatorname{TopScopeId}([\langle S,\ M\rangle ]\ \mathbin{++} \ \Sigma \_\pi )\ =\ S \\[0.16em]
\operatorname{StackProv}(\Sigma \_\pi )\ =\ \pi_{\mathsf{Stack}} (\operatorname{TopScopeId}(\Sigma \_\pi ))
\end{array}
$$

$$
\begin{array}{l}
\mathsf{PushScope}\_\pi (\Sigma \_\pi )\ =\ [\langle S,\ \emptyset \rangle ]\ \mathbin{++} \ \Sigma \_\pi \quad (S\ \mathsf{fresh}) \\[0.16em]
\mathsf{PopScope}\_\pi ([\_]\ \mathbin{++} \ \Sigma \_\pi )\ =\ \Sigma \_\pi 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Lookup}\_\pi ([\langle S,\ M\rangle ]\ \mathbin{++} \ \Sigma \_\pi ,\ x)\ = \\[0.16em]
\ \{\ M[x]\quad \mathsf{if}\ x\ \in \ \operatorname{dom}(M) \\[0.16em]
\quad \mathsf{Lookup}\_\pi (\Sigma \_\pi ,\ x)\quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\mathsf{Intro}\_\pi ([\langle S,\ M\rangle ]\ \mathbin{++} \ \Sigma \_\pi ,\ x,\ \pi )\ =\ [\langle S,\ M[x\ \mapsto \ \pi ]\rangle ]\ \mathbin{++} \ \Sigma \_\pi 
$$

$$
\begin{array}{l}
\mathsf{IntroAll}\_\pi (\Sigma \_\pi ,\ [],\ \pi )\ =\ \Sigma \_\pi  \\[0.16em]
\mathsf{IntroAll}\_\pi (\Sigma \_\pi ,\ [x]\ \mathbin{++} \ \mathsf{xs},\ \pi )\ =\ \mathsf{IntroAll}\_\pi (\mathsf{Intro}\_\pi (\Sigma \_\pi ,\ x,\ \pi ),\ \mathsf{xs},\ \pi )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ParamProvMap}(\mathsf{params},\ \mathsf{vec}\pi )\ =\ \{\ x_{i}\ \mapsto \ \pi_{i} \ \mid \ \mathsf{params}\ =\ [\langle \_,\ x_{i},\ \_\rangle ],\ \mathsf{vec}\pi \ =\ [\pi_{i} ]\ \} \\[0.16em]
\operatorname{InitProvEnv}(\mathsf{params},\ \mathsf{vec}\pi ,\ \mathsf{RS})\ =\ \langle [\langle S,\ \operatorname{ParamProvMap}(\mathsf{params},\ \mathsf{vec}\pi )\rangle ],\ \mathsf{RS}\rangle \quad (S\ \mathsf{fresh})
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ResolveEntry}\_\pi ([],\ \mathsf{tag})\ =\ \bot  \\[0.16em]
\mathsf{ResolveEntry}\_\pi ([\langle \mathsf{tag}_{i},\ \mathsf{target}_{i}\rangle ]\ \mathbin{++} \ \mathsf{RS},\ \mathsf{tag})\ = \\[0.16em]
\ \{\ \langle \mathsf{tag}_{i},\ \mathsf{target}_{i}\rangle \quad \mathsf{if}\ \mathsf{tag}_{i}\ =\ \mathsf{tag} \\[0.16em]
\quad \mathsf{ResolveEntry}\_\pi (\mathsf{RS},\ \mathsf{tag})\ \mathsf{otherwise}\ \}
\end{array}
$$

$$
\mathsf{ResolveTarget}\_\pi (\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle ,\ \mathsf{tag})\ =\ \mathsf{target}\ \Leftrightarrow \ \mathsf{ResolveEntry}\_\pi (\mathsf{RS},\ \mathsf{tag})\ =\ \langle \mathsf{tag},\ \mathsf{target}\rangle 
$$

$$
\mathsf{IntroRegionAlias}\_\pi (\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle ,\ \mathsf{tag},\ x)\ =\ \langle \Sigma \_\pi ,\ [\langle \mathsf{tag},\ x\rangle ]\ \mathbin{++} \ \mathsf{RS}\rangle 
$$

$$
\operatorname{FreshRegionTag}(\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle )\ =\ \mathsf{tag}\ \Leftrightarrow \ \mathsf{tag}\ \notin \ \{\ \mathsf{tag}_{i}\ \mid \ \langle \mathsf{tag}_{i},\ \_\rangle \ \in \ \mathsf{RS}\ \}
$$

$$
\begin{array}{l}
\operatorname{AllocTag}([],\ r)\ =\ \bot  \\[0.16em]
\operatorname{AllocTag}([\langle \mathsf{tag},\ \mathsf{target}\rangle ]\ \mathbin{++} \ \mathsf{RS},\ \bot )\ =\ \mathsf{tag} \\[0.16em]
\operatorname{AllocTag}([\langle \mathsf{tag},\ \mathsf{target}\rangle ]\ \mathbin{++} \ \mathsf{RS},\ r)\ = \\[0.16em]
\ \{\ \mathsf{tag}\quad \mathsf{if}\ \mathsf{target}\ =\ r \\[0.16em]
\quad \operatorname{AllocTag}(\mathsf{RS},\ r)\ \mathsf{otherwise}\ \}
\end{array}
$$

$$
\operatorname{FreshRegionExpr}(\mathsf{init})\ \Leftrightarrow \ \mathsf{init}\ \mathsf{denotes}\ a\ \mathsf{fresh}\ \texttt{Region@Active}\ \mathsf{value}\ \mathsf{created}\ \mathsf{by}\ \mathsf{region}-\mathsf{opening}\ \mathsf{evaluation},\ \mathsf{including}\ \texttt{Region::new\_scoped(...)}
$$

$$
\begin{array}{l}
\mathsf{ProvPlaceJudg}\ =\ \{\Gamma ;\ \Omega \ \vdash \ p\ \Downarrow \ \pi \} \\[0.16em]
\mathsf{ProvExprJudg}\ =\ \{\Gamma ;\ \Omega \ \vdash \ e\ \Downarrow \ \pi \} \\[0.16em]
\mathsf{ProvStmtJudg}\ =\ \{\Gamma ;\ \Omega \ \vdash \ s\ \Rightarrow \ \Omega '\ \triangleright \ \langle \mathsf{Res},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle ,\ \Gamma ;\ \Omega \ \vdash \ \mathsf{ss}\ \Rightarrow \ \Omega '\ \triangleright \ \langle \mathsf{Res},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \} \\[0.16em]
\mathsf{BlockProvJudg}\ =\ \{\Gamma ;\ \Omega \ \vdash \ \operatorname{BlockProv}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}})\ \Downarrow \ \pi \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CaseBodyProv}(e,\ \Omega )\ =\ \pi \ \Leftrightarrow \ \Gamma ;\ \Omega \ \vdash \ e\ \Downarrow \ \pi  \\[0.16em]
\operatorname{CaseBodyProv}(b,\ \Omega )\ =\ \pi \ \Leftrightarrow \ \Gamma ;\ \Omega \ \vdash \ b\ \Downarrow \ \pi  \\[0.16em]
\operatorname{CaseEnv}(\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle ,\ \mathsf{pat})\ =\ \langle \Sigma \_\pi ',\ \mathsf{RS}\rangle \ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{pat})\ \Downarrow \ N\ \land \ \pi_{b} \ =\ \operatorname{BindProv}(\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle ,\ \bot )\ \land \ \Sigma \_\pi '\ =\ \mathsf{IntroAll}\_\pi (\Sigma \_\pi ,\ N,\ \pi_{b} ) \\[0.16em]
\operatorname{CaseProv}(\langle \mathsf{pat},\ \mathsf{body}\rangle )\ =\ \pi \ \Leftrightarrow \ \operatorname{CaseEnv}(\Omega ,\ \mathsf{pat})\ =\ \Omega '\ \land \ \operatorname{CaseBodyProv}(\mathsf{body},\ \Omega ')\ =\ \pi  \\[0.16em]
\operatorname{CaseElseProv}(\bot ,\ \Omega )\ =\ [] \\[0.16em]
\operatorname{CaseElseProv}(b,\ \Omega )\ =\ [\pi ]\ \Leftrightarrow \ \operatorname{CaseBodyProv}(b,\ \Omega )\ =\ \pi 
\end{array}
$$

**(P-Region-Alloc-Method)**

$$
\begin{array}{l}
\Gamma ;\ \Omega \ \vdash \ \mathsf{recv}\ \Downarrow \ \pi_{\mathsf{Region}} (\mathsf{tag})\quad \Gamma ;\ \Omega \ \vdash \ \mathsf{arg}_{i}\ \Downarrow \ \pi_{i} \quad \mathsf{for}\ \mathsf{every}\ \mathsf{argument} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \operatorname{MethodCall}(\mathsf{recv},\ \texttt{alloc},\ \mathsf{args})\ \Downarrow \ \pi_{\mathsf{Region}} (\mathsf{tag})
\end{array}
$$

**(P-If-Is)**

$$
\begin{array}{l}
\operatorname{CaseProv}(\langle \mathsf{pat},\ \mathsf{then}_{\mathsf{block}}\rangle )\ =\ \pi_{t} \quad \operatorname{CaseElseProv}(\mathsf{else}_{\mathsf{opt}},\ \Omega )\ =\ \pi_{\mathsf{else}} \quad \operatorname{JoinAllProv}([\pi_{t} ]\ \mathbin{++} \ \pi_{\mathsf{else}} )\ =\ \pi  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \operatorname{IfIsExpr}(\_,\ \mathsf{pat},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \pi 
\end{array}
$$

**(P-If-Cases)**

$$
\begin{array}{l}
\forall \ i,\ \operatorname{CaseProv}(\mathsf{case}_{i})\ =\ \pi_{i} \quad \operatorname{CaseElseProv}(\mathsf{else}_{\mathsf{opt}},\ \Omega )\ =\ \pi_{\mathsf{else}} \quad \operatorname{JoinAllProv}([\pi_{1} ,\ \ldots ,\ \pi_{n} ]\ \mathbin{++} \ \pi_{\mathsf{else}} )\ =\ \pi  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \operatorname{IfCaseExpr}(\_,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \pi 
\end{array}
$$

**Closure Provenance.**

$$
\begin{array}{l}
\operatorname{ClosureCaptureProv}(C,\ \Omega )\ =\ [\pi_{x} \ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \land \ \mathsf{Lookup}\_\pi (\Sigma \_\pi ,\ x)\ =\ \pi_{x} ] \\[0.16em]
\operatorname{ClosureTargetProv}(C,\ \Omega )\ = \\[0.16em]
\ \{\ \operatorname{FrameProv}(\Gamma ,\ \Omega )\quad \mathsf{if}\ \operatorname{IsEscaping}(C) \\[0.16em]
\quad \operatorname{StackProv}(\Sigma \_\pi )\quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{ClosureLocalSharedCaptures}(C,\ \Gamma )\ =\ [x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \land \ (\exists \ S\ \in \ \operatorname{LocalScopes}(\Gamma ).\ x\ \in \ \operatorname{dom}(S))\ \land \ (\exists \ T.\ \operatorname{BindOf}(\Gamma ,\ x)\ =\ \langle \_,\ \mathsf{shared}\ T\rangle )] \\[0.16em]
\operatorname{ClosureEscapeCheck}(C,\ \Omega )\ \Leftrightarrow  \\[0.16em]
\ (\forall \ \pi_{x} \ \in \ \operatorname{ClosureCaptureProv}(C,\ \Omega ).\ \lnot (\pi_{x} \ <\ \operatorname{ClosureTargetProv}(C,\ \Omega )))\ \land  \\[0.16em]
\ (\lnot \operatorname{IsEscaping}(C)\ \lor \ \operatorname{ClosureLocalSharedCaptures}(C,\ \Gamma )\ =\ \emptyset )
\end{array}
$$

**(P-Closure-NonCapturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset \quad \Gamma ;\ \Omega \ \vdash \ \mathsf{body}\ \Downarrow \ \pi_{\mathsf{body}}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ C\ \Downarrow \ \pi_{\mathsf{Global}} 
\end{array}
$$

**(P-Closure-Capturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset \quad \operatorname{ClosureEscapeCheck}(C,\ \Omega ) \\[0.16em]
\operatorname{ClosureCaptureProv}(C,\ \Omega )\ =\ [\pi_{1} ,\ \ldots ,\ \pi_{n} ]\quad \operatorname{JoinAllProv}([\pi_{1} ,\ \ldots ,\ \pi_{n} ])\ =\ \pi_{\mathsf{cap}} \quad \Gamma ;\ \Omega \ \vdash \ \mathsf{body}\ \Downarrow \ \pi_{\mathsf{body}}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ C\ \Downarrow \ \pi_{\mathsf{cap}} 
\end{array}
$$

**(P-Closure-Escape-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset \quad \lnot \operatorname{ClosureEscapeCheck}(C,\ \Omega ) \\[0.16em]
\exists \ x\ \in \ \operatorname{CaptureSet}(C).\ x\ \in \ \operatorname{ClosureLocalSharedCaptures}(C,\ \Gamma )\ \lor \ (\mathsf{Lookup}\_\pi (\Sigma \_\pi ,\ x)\ =\ \pi_{x} \ \land \ \pi_{x} \ <\ \operatorname{ClosureTargetProv}(C,\ \Omega ))\quad c\ =\ \operatorname{Code}(E-\mathsf{CON}-0086) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ C\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FrameProv}(\Gamma ,\ \langle \Sigma \_\pi ,\ \mathsf{RS}\rangle )\ = \\[0.16em]
\ \{\ \pi_{\mathsf{Region}} (r)\quad \mathsf{if}\ \exists \ r.\ \operatorname{InnermostFrameRegion}(\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle )\ =\ r \\[0.16em]
\quad \operatorname{StackProv}(\Sigma \_\pi )\ \mathsf{otherwise}\ \}
\end{array}
$$

**Loop Provenance.**

$$
\operatorname{BreakProv}(\mathsf{body},\ \Omega )\ =\ \langle \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \ \Leftrightarrow \ \mathsf{body}\ =\ \operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}})\ \land \ \Omega_{0} \ =\ \langle \mathsf{PushScope}\_\pi (\Sigma \_\pi ),\ \mathsf{RS}\rangle \ \land \ \Gamma ;\ \Omega_{0} \ \vdash \ \mathsf{stmts}\ \Rightarrow \ \Omega_{1} \ \triangleright \ \langle \mathsf{Res},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \ \land \ (\mathsf{tail}_{\mathsf{opt}}\ =\ e\ \Rightarrow \ \Gamma ;\ \Omega_{1} \ \vdash \ e\ \Downarrow \ \pi_{t} )
$$

$$
\operatorname{IterElemProv}(\mathsf{iter},\ \Omega )\ =\ \pi \ \Leftrightarrow \ \Gamma ;\ \Omega \ \vdash \ \mathsf{iter}\ \Downarrow \ \pi 
$$

$$
\begin{array}{l}
\operatorname{LoopProvInf}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ \bot \ \Leftrightarrow \ \mathsf{Brk}\ =\ [] \\[0.16em]
\operatorname{LoopProvInf}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ \pi \ \Leftrightarrow \ \mathsf{Brk}\ =\ [\pi_{1} ,\ \ldots ,\ \pi_{n} ]\ \land \ \mathsf{BrkVoid}\ =\ \mathsf{false}\ \land \ \operatorname{JoinAllProv}([\pi_{1} ,\ \ldots ,\ \pi_{n} ])\ =\ \pi 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LoopProvFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ \bot \ \Leftrightarrow \ \mathsf{Brk}\ =\ [] \\[0.16em]
\operatorname{LoopProvFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ \pi \ \Leftrightarrow \ \mathsf{Brk}\ =\ [\pi_{1} ,\ \ldots ,\ \pi_{n} ]\ \land \ \mathsf{BrkVoid}\ =\ \mathsf{false}\ \land \ \operatorname{JoinAllProv}([\pi_{1} ,\ \ldots ,\ \pi_{n} ])\ =\ \pi 
\end{array}
$$

$$
\operatorname{ExtendProv}(\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle ,\ \mathsf{pat},\ \pi )\ =\ \langle \Sigma \_\pi ',\ \mathsf{RS}\rangle \ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{pat})\ \Downarrow \ N\ \land \ \Sigma \_\pi '\ =\ \mathsf{IntroAll}\_\pi (\Sigma \_\pi ,\ N,\ \pi )
$$

**(P-Loop-Infinite)**

$$
\begin{array}{l}
\operatorname{BreakProv}(\mathsf{body},\ \Omega )\ =\ \langle \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopProvInf}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ \pi  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \Downarrow \ \pi 
\end{array}
$$

**(P-Loop-Conditional)**

$$
\begin{array}{l}
\operatorname{BreakProv}(\mathsf{body},\ \Omega )\ =\ \langle \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopProvFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ \pi  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \Downarrow \ \pi 
\end{array}
$$

**(P-Loop-Iter)**

$$
\begin{array}{l}
\operatorname{IterElemProv}(\mathsf{iter},\ \Omega )\ =\ \pi_{\mathsf{elem}} \quad \operatorname{ExtendProv}(\Omega ,\ \mathsf{pat},\ \pi_{\mathsf{elem}} )\ =\ \Omega '\quad \operatorname{BreakProv}(\mathsf{body},\ \Omega ')\ =\ \langle \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopProvFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ \pi  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \Downarrow \ \pi 
\end{array}
$$

$$
\operatorname{EscapeOk}(\pi_{e} ,\ \pi_{x} )\ \Leftrightarrow \ \lnot (\pi_{e} \ <\ \pi_{x} )
$$

The language introduces no general heap-escape conversion. Heap provenance arises only from operations whose declared signatures explicitly accept a `$HeapAllocator` capability and return a heap-backed value.

$$
\begin{array}{l}
\operatorname{BindProv}(\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle ,\ \pi_{\mathsf{init}} )\ = \\[0.16em]
\ \{\ \operatorname{StackProv}(\Sigma \_\pi )\quad \mathsf{if}\ \pi_{\mathsf{init}} \ =\ \bot  \\[0.16em]
\quad \pi_{\mathsf{init}} \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{StaticBindProv}\ =\ \pi_{\mathsf{Global}}  \\[0.16em]
\operatorname{AssignProvOk}(\Omega ,\ p,\ e)\ \Leftrightarrow \ \Gamma ;\ \Omega \ \vdash \ p\ \Downarrow \ \pi_{x} \ \land \ \Gamma ;\ \Omega \ \vdash \ e\ \Downarrow \ \pi_{e} \ \land \ \operatorname{EscapeOk}(\pi_{e} ,\ \pi_{x} ) \\[0.16em]
\mathsf{ProvenanceEscapeJudg}\ =\ \{\mathsf{EscapeOk},\ \mathsf{AssignProvOk},\ \mathsf{ClosureEscapeCheck}\}
\end{array}
$$

The provenance system prevents pointers with shorter lifetimes from escaping to storage with longer lifetimes. The escape check `EscapeOk(π_e, π_x)` is consumed by the feature-local rules for assignments, closures, and async creation.

## 6.5 Dynamic Scope Stack, Bindings, and Region Runtime

### 6.5.1 Dynamic Scope Stack and Binding Store

$$
\begin{array}{l}
\mathsf{ScopeEntry}\ =\ \langle \mathsf{scope}_{\mathsf{id}},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle  \\[0.16em]
\operatorname{ScopeId}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle )\ =\ \mathsf{sid} \\[0.16em]
\operatorname{ScopeCleanup}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle )\ =\ \mathsf{cleanup} \\[0.16em]
\operatorname{ScopeNames}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle )\ =\ \mathsf{names} \\[0.16em]
\operatorname{ScopeVals}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle )\ =\ \mathsf{vals} \\[0.16em]
\operatorname{ScopeStates}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle )\ =\ \mathsf{states}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ScopeStack}(\sigma )\ \in \ [\mathsf{ScopeEntry}] \\[0.16em]
\operatorname{CurrentScope}(\sigma )\ =\ \mathsf{scope}\ \Leftrightarrow \ \operatorname{ScopeStack}(\sigma )\ =\ \mathsf{scope}\ \mathbin{::} \ \mathsf{ss} \\[0.16em]
\operatorname{CurrentScopeId}(\sigma )\ =\ \operatorname{ScopeId}(\operatorname{CurrentScope}(\sigma )) \\[0.16em]
\operatorname{ScopeEmpty}(\mathsf{sid})\ =\ \langle \mathsf{sid},\ [],\ \emptyset ,\ \emptyset ,\ \emptyset \rangle  \\[0.16em]
\operatorname{FreshScopeId}(\sigma )\ =\ \mathsf{sid}\ \Rightarrow \ \forall \ s\ \in \ \operatorname{ScopeStack}(\sigma ).\ \operatorname{ScopeId}(s)\ \ne \ \mathsf{sid}
\end{array}
$$

$$
\operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{ss})\ =\ \sigma '\ \Leftrightarrow \ \operatorname{ScopeStack}(\sigma ')\ =\ \mathsf{ss}\ \land \ \operatorname{AddrTags}(\sigma ')\ =\ \operatorname{AddrTags}(\sigma )\ \land \ \operatorname{RegionStack}(\sigma ')\ =\ \operatorname{RegionStack}(\sigma )\ \land \ \operatorname{RegionArena}(\sigma ')\ =\ \operatorname{RegionArena}(\sigma )\ \land \ \operatorname{PoisonedModules}(\sigma ')\ =\ \operatorname{PoisonedModules}(\sigma )
$$

$$
\begin{array}{l}
\mathsf{PushScope}\_\sigma (\sigma )\ \Downarrow \ (\sigma ',\ \mathsf{scope})\ \Leftrightarrow \ \mathsf{scope}\ =\ \operatorname{ScopeEmpty}(\mathsf{sid})\ \land \ \operatorname{FreshScopeId}(\sigma )\ =\ \mathsf{sid}\ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{scope}\ \mathbin{::} \ \operatorname{ScopeStack}(\sigma ))\ =\ \sigma ' \\[0.16em]
\mathsf{PopScope}\_\sigma (\sigma )\ \Downarrow \ (\sigma ',\ \mathsf{scope})\ \Leftrightarrow \ \operatorname{ScopeStack}(\sigma )\ =\ \mathsf{scope}\ \mathbin{::} \ \mathsf{ss}\ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{ss})\ =\ \sigma '
\end{array}
$$

$$
\operatorname{AppendCleanup}(\sigma ,\ \mathsf{item})\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ScopeStack}(\sigma )\ =\ \mathsf{scope}\ \mathbin{::} \ \mathsf{ss}\ \land \ \mathsf{scope}\ =\ \langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle \ \land \ \mathsf{scope}'\ =\ \langle \mathsf{sid},\ \mathsf{cleanup}\ \mathbin{++} \ [\mathsf{item}],\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle \ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{scope}'\ \mathbin{::} \ \mathsf{ss})\ =\ \sigma '
$$

$$
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \operatorname{ScopeCleanup}(\mathsf{scope}) \\[0.16em]
\operatorname{ScopeById}([],\ \mathsf{sid})\ =\ \bot  \\[0.16em]
\operatorname{ScopeById}(\mathsf{scope}\ \mathbin{::} \ \mathsf{ss},\ \mathsf{sid})\ = \\[0.16em]
\ \mathsf{scope}\quad \mathsf{if}\ \operatorname{ScopeId}(\mathsf{scope})\ =\ \mathsf{sid} \\[0.16em]
\ \operatorname{ScopeById}(\mathsf{ss},\ \mathsf{sid})\quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReplaceScopeById}([],\ \mathsf{sid},\ \mathsf{scope}')\ =\ \bot  \\[0.16em]
\operatorname{ReplaceScopeById}(\mathsf{scope}\ \mathbin{::} \ \mathsf{ss},\ \mathsf{sid},\ \mathsf{scope}')\ = \\[0.16em]
\ \mathsf{scope}'\ \mathbin{::} \ \mathsf{ss}\quad \mathsf{if}\ \operatorname{ScopeId}(\mathsf{scope})\ =\ \mathsf{sid} \\[0.16em]
\ \mathsf{scope}\ \mathbin{::} \ \operatorname{ReplaceScopeById}(\mathsf{ss},\ \mathsf{sid},\ \mathsf{scope}')\ \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{xs},\ \sigma )\ \Downarrow \ \sigma '\ \Leftrightarrow \ \mathsf{sid}\ =\ \operatorname{ScopeId}(\mathsf{scope})\ \land \ \mathsf{scope}'\ =\ \langle \mathsf{sid},\ \mathsf{xs},\ \operatorname{ScopeNames}(\mathsf{scope}),\ \operatorname{ScopeVals}(\mathsf{scope}),\ \operatorname{ScopeStates}(\mathsf{scope})\rangle \ \land \ \operatorname{ReplaceScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid},\ \mathsf{scope}')\ =\ \mathsf{ss}'\ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{ss}')\ =\ \sigma '
$$

$$
\operatorname{PoisonedModule}(\sigma ,\ \mathsf{path})\ \Leftrightarrow \ \exists \ m.\ \operatorname{PathOfModule}(m)\ =\ \mathsf{path}\ \land \ \operatorname{ReadAddr}(\sigma ,\ \operatorname{AddrOfSym}(\operatorname{PoisonFlag}(m)))\ \ne \ 0
$$

For hosted-library session execution, §24.4.1 reinterprets the `AddrOfSym(PoisonFlag(m))` occurrence above session-locally for every hosted-state symbol.

$$
\operatorname{PoisonedModules}(\sigma )\ =\ \{\mathsf{path}\ \mid \ \operatorname{PoisonedModule}(\sigma ,\ \mathsf{path})\}
$$

$$
\begin{array}{l}
\mathsf{Binding}\ =\ \langle \mathsf{scope}_{\mathsf{id}},\ \mathsf{bind}_{\mathsf{id}},\ \mathsf{name}\rangle  \\[0.16em]
\mathsf{BindingValue}\ =\ \mathsf{Value}\ \cup \ \{\operatorname{Alias}(\mathsf{addr})\ \mid \ \mathsf{addr}\ \in \ \mathsf{Addr}\}
\end{array}
$$

$$
\operatorname{FreshBindId}(\sigma )\ =\ b\ \Rightarrow \ \forall \ x.\ \operatorname{ScopeNames}(\operatorname{CurrentScope}(\sigma ))[x]\ \mathsf{defined}\ \Rightarrow \ b\ \notin \ \operatorname{ScopeNames}(\operatorname{CurrentScope}(\sigma ))[x]
$$

$$
\begin{array}{l}
\operatorname{Last}([a])\ =\ a \\[0.16em]
\operatorname{Last}(a\ \mathbin{::} \ \mathsf{as})\ =\ \operatorname{Last}(\mathsf{as})\quad (\mid \mathsf{as}\mid \ >\ 0)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{NearestScope}([],\ x)\ =\ \bot  \\[0.16em]
\operatorname{NearestScope}(\mathsf{scope}\ \mathbin{::} \ \mathsf{ss},\ x)\ = \\[0.16em]
\ \mathsf{scope}\quad \mathsf{if}\ \operatorname{ScopeNames}(\mathsf{scope})[x]\ \mathsf{defined} \\[0.16em]
\ \operatorname{NearestScope}(\mathsf{ss},\ x)\quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LookupBind}(\sigma ,\ x)\ =\ \langle \operatorname{ScopeId}(\mathsf{scope}),\ b,\ x\rangle \ \Leftrightarrow \ \operatorname{NearestScope}(\operatorname{ScopeStack}(\sigma ),\ x)\ =\ \mathsf{scope}\ \land \ b\ =\ \operatorname{Last}(\operatorname{ScopeNames}(\mathsf{scope})[x]) \\[0.16em]
\operatorname{BindingValue}(\sigma ,\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ =\ v\ \Leftrightarrow \ \operatorname{ScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid})\ =\ \mathsf{scope}\ \land \ \operatorname{ScopeVals}(\mathsf{scope})[\mathsf{bind}_{\mathsf{id}}]\ =\ v \\[0.16em]
\operatorname{BindState}(\sigma ,\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ =\ s\ \Leftrightarrow \ \operatorname{ScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid})\ =\ \mathsf{scope}\ \land \ \operatorname{ScopeStates}(\mathsf{scope})[\mathsf{bind}_{\mathsf{id}}]\ =\ s
\end{array}
$$

**(LookupVal-Bind-Value)**

$$
\begin{array}{l}
\operatorname{LookupBind}(\sigma ,\ x)\ =\ b\quad \operatorname{BindingValue}(\sigma ,\ b)\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupVal}(\sigma ,\ x)\ =\ v
\end{array}
$$

**(LookupVal-Bind-Alias)**

$$
\begin{array}{l}
\operatorname{LookupBind}(\sigma ,\ x)\ =\ b\quad \operatorname{BindingValue}(\sigma ,\ b)\ =\ \operatorname{Alias}(\mathsf{addr})\quad \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupVal}(\sigma ,\ x)\ =\ v
\end{array}
$$

**(LookupVal-Path)**

$$
\begin{array}{l}
\operatorname{LookupBind}(\sigma ,\ x)\ \mathsf{undefined}\quad \Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \mathsf{name}\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ x)\quad \lnot \ \operatorname{PoisonedModule}(\sigma ,\ \operatorname{PathOfModule}(\mathsf{mp}))\quad \operatorname{LookupValPath}(\sigma ,\ \operatorname{PathOfModule}(\mathsf{mp}),\ \mathsf{name})\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupVal}(\sigma ,\ x)\ =\ v
\end{array}
$$

**(LookupValPath-Builtin)**

$$
\begin{array}{l}
\operatorname{BuiltinValuePath}(\mathsf{path},\ \mathsf{name})\quad ((\mathsf{path}\ =\ [\texttt{"Region"}]\ \land \ \mathsf{name}\ =\ \texttt{new\_scoped}\ \land \ \Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\texttt{Region::new\_scoped})\ \Downarrow \ \mathsf{sym})\ \lor \ (\mathsf{path}\ =\ [\texttt{"CancelToken"}]\ \land \ \mathsf{name}\ =\ \texttt{new}\ \land \ \Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\texttt{CancelToken::new})\ \Downarrow \ \mathsf{sym})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupValPath}(\sigma ,\ \mathsf{path},\ \mathsf{name})\ =\ \operatorname{FuncVal}(\mathsf{sym})
\end{array}
$$

**(LookupValPath-Static)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \mathsf{path}'\ =\ \operatorname{PathOfModule}(\mathsf{mp})\quad \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\quad \lnot \ \operatorname{PoisonedModule}(\sigma ,\ \mathsf{path}')\quad \operatorname{StaticAddr}(\mathsf{path}',\ \mathsf{name}')\ =\ \mathsf{addr}\quad \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupValPath}(\sigma ,\ \mathsf{path},\ \mathsf{name})\ =\ v
\end{array}
$$

**(LookupValPath-Proc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \mathsf{path}'\ =\ \operatorname{PathOfModule}(\mathsf{mp})\quad \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\quad \lnot \ \operatorname{PoisonedModule}(\sigma ,\ \mathsf{path}')\quad \operatorname{DeclOf}(\mathsf{path}',\ \mathsf{name}')\ =\ \mathsf{proc}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{proc})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupValPath}(\sigma ,\ \mathsf{path},\ \mathsf{name})\ =\ \operatorname{FuncVal}(\mathsf{sym})
\end{array}
$$

**(LookupValPath-RecordCtor)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p\quad \operatorname{SplitLast}(p)\ =\ (\mathsf{mp},\ \_)\quad \lnot \ \operatorname{PoisonedModule}(\sigma ,\ \mathsf{mp}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupValPath}(\sigma ,\ \mathsf{path},\ \mathsf{name})\ =\ \operatorname{RecordCtor}(p)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ScopeValsUpdate}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle ,\ \mathsf{bind}_{\mathsf{id}},\ v)\ =\ \langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals}[\mathsf{bind}_{\mathsf{id}}\ \mapsto \ v],\ \mathsf{states}\rangle  \\[0.16em]
\operatorname{ScopeStatesUpdate}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle ,\ \mathsf{bind}_{\mathsf{id}},\ s)\ =\ \langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}[\mathsf{bind}_{\mathsf{id}}\ \mapsto \ s]\rangle 
\end{array}
$$

$$
\operatorname{UpdateVal}(\sigma ,\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle ,\ v)\ \Downarrow \ \sigma '\ \Leftrightarrow \ (\operatorname{BindingValue}(\sigma ,\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ =\ \operatorname{Alias}(\mathsf{addr})\ \land \ \operatorname{WriteAddr}(\sigma ,\ \mathsf{addr},\ v)\ \Downarrow \ \sigma ')\ \lor \ (\operatorname{BindingValue}(\sigma ,\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ \ne \ \operatorname{Alias}(\_)\ \land \ \operatorname{ScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid})\ =\ \mathsf{scope}\ \land \ \mathsf{scope}'\ =\ \operatorname{ScopeValsUpdate}(\mathsf{scope},\ \mathsf{bind}_{\mathsf{id}},\ v)\ \land \ \operatorname{ReplaceScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid},\ \mathsf{scope}')\ =\ \mathsf{ss}'\ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{ss}')\ =\ \sigma ')
$$

$$
\operatorname{SetState}(\sigma ,\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle ,\ s)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid})\ =\ \mathsf{scope}\ \land \ \mathsf{scope}'\ =\ \operatorname{ScopeStatesUpdate}(\mathsf{scope},\ \mathsf{bind}_{\mathsf{id}},\ s)\ \land \ \operatorname{ReplaceScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid},\ \mathsf{scope}')\ =\ \mathsf{ss}'\ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{ss}')\ =\ \sigma '
$$

$$
\begin{array}{l}
\operatorname{TypeOf}(\langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ =\ \operatorname{TypeOf}(x) \\[0.16em]
\operatorname{BindInfo}(\langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ =\ \operatorname{BindInfo}(x)
\end{array}
$$

$$
\operatorname{BindVal}(\sigma ,\ x,\ v)\ \Downarrow \ (\sigma ',\ b)\ \Leftrightarrow \ \operatorname{ScopeStack}(\sigma )\ =\ \mathsf{scope}\ \mathbin{::} \ \mathsf{ss}\ \land \ \mathsf{scope}\ =\ \langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle \ \land \ \mathsf{bind}_{\mathsf{id}}\ =\ \operatorname{FreshBindId}(\sigma )\ \land \ \mathsf{names}'\ =\ \mathsf{names}[x\ \mapsto \ (\mathsf{names}[x]\ \mathsf{if}\ \mathsf{present}\ \mathsf{else}\ [])\ \mathbin{++} \ [\mathsf{bind}_{\mathsf{id}}]]\ \land \ \mathsf{vals}'\ =\ \mathsf{vals}[\mathsf{bind}_{\mathsf{id}}\ \mapsto \ v]\ \land \ \mathsf{states}'\ =\ \mathsf{states}[\mathsf{bind}_{\mathsf{id}}\ \mapsto \ \texttt{Valid}]\ \land \ \mathsf{scope}'\ =\ \langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names}',\ \mathsf{vals}',\ \mathsf{states}'\rangle \ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{scope}'\ \mathbin{::} \ \mathsf{ss})\ =\ \sigma_{1} \ \land \ b\ =\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle \ \land \ ((\operatorname{BindInfo}(b).\mathsf{resp}\ =\ \mathsf{resp}\ \land \ \operatorname{AppendCleanup}(\sigma_{1} ,\ \operatorname{DropBinding}(b))\ \Downarrow \ \sigma ')\ \lor \ (\operatorname{BindInfo}(b).\mathsf{resp}\ \ne \ \mathsf{resp}\ \land \ \sigma '\ =\ \sigma_{1} ))
$$

$$
\begin{array}{l}
\operatorname{BindPatternVal}(p,\ v)\ \Downarrow \ B\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{MatchPattern}(p,\ v)\ \Downarrow \ B \\[0.16em]
\operatorname{BindOrder}(p,\ B)\ =\ [\langle x,\ B[x]\rangle \ \mid \ x\ \in \ \operatorname{PatNames}(p)]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BindList}(\sigma ,\ [])\ \Downarrow \ (\sigma ,\ []) \\[0.16em]
\operatorname{BindList}(\sigma ,\ [\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ (\sigma_{2} ,\ b\ \mathbin{::} \ \mathsf{bs})\ \Leftrightarrow \ \operatorname{BindVal}(\sigma ,\ x,\ v)\ \Downarrow \ (\sigma_{1} ,\ b)\ \land \ \operatorname{BindList}(\sigma_{1} ,\ \mathsf{xs})\ \Downarrow \ (\sigma_{2} ,\ \mathsf{bs})
\end{array}
$$

$$
\operatorname{BindPattern}(\sigma ,\ p,\ v)\ \Downarrow \ (\sigma ',\ \mathsf{bs})\ \Leftrightarrow \ \operatorname{BindPatternVal}(p,\ v)\ \Downarrow \ B\ \land \ \operatorname{BindOrder}(p,\ B)\ =\ \mathsf{binds}\ \land \ \operatorname{BindList}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma ',\ \mathsf{bs})
$$

### 6.5.2 Region Stack and Arenas

$$
\begin{array}{l}
\mathsf{RegionEntry}\ =\ \langle \mathsf{tag},\ \mathsf{target},\ \mathsf{scope},\ \mathsf{mark}_{\mathsf{opt}}\rangle  \\[0.16em]
\operatorname{RegionTagOf}(\langle \mathsf{tag},\ \mathsf{target},\ \mathsf{scope},\ \mathsf{mark}_{\mathsf{opt}}\rangle )\ =\ \mathsf{tag} \\[0.16em]
\operatorname{RegionTargetOf}(\langle \mathsf{tag},\ \mathsf{target},\ \mathsf{scope},\ \mathsf{mark}_{\mathsf{opt}}\rangle )\ =\ \mathsf{target} \\[0.16em]
\operatorname{RegionScopeOf}(\langle \mathsf{tag},\ \mathsf{target},\ \mathsf{scope},\ \mathsf{mark}_{\mathsf{opt}}\rangle )\ =\ \mathsf{scope} \\[0.16em]
\operatorname{RegionMarkOf}(\langle \mathsf{tag},\ \mathsf{target},\ \mathsf{scope},\ \mathsf{mark}_{\mathsf{opt}}\rangle )\ =\ \mathsf{mark}_{\mathsf{opt}}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{RuntimeTag}\ =\ \{\operatorname{RegionTag}(\mathsf{tag}),\ \operatorname{ScopeTag}(\mathsf{sid})\} \\[0.16em]
\operatorname{RegionStack}(\sigma )\ \in \ [\mathsf{RegionEntry}] \\[0.16em]
\operatorname{AddrTags}(\sigma )\ :\ \mathsf{Addr}\ \rightharpoonup \ \mathsf{RuntimeTag}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RegionArena}(\sigma )\ :\ \mathsf{usize}\ \rightharpoonup \ [\mathsf{Addr}] \\[0.16em]
\operatorname{ArenaAllocs}(\sigma ,\ r)\ =\ \mathsf{allocs}\ \Leftrightarrow \ \operatorname{RegionArena}(\sigma )(r)\ =\ \mathsf{allocs}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{UpdateRegionArena}(\sigma ,\ \mathsf{RA})\ =\ \sigma '\ \Leftrightarrow \ \operatorname{RegionArena}(\sigma ')\ =\ \mathsf{RA}\ \land \ \operatorname{ScopeStack}(\sigma ')\ =\ \operatorname{ScopeStack}(\sigma )\ \land \ \operatorname{AddrTags}(\sigma ')\ =\ \operatorname{AddrTags}(\sigma )\ \land \ \operatorname{RegionStack}(\sigma ')\ =\ \operatorname{RegionStack}(\sigma )\ \land \ \operatorname{PoisonedModules}(\sigma ')\ =\ \operatorname{PoisonedModules}(\sigma ) \\[0.16em]
\operatorname{ArenaNew}(\sigma ,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{UpdateRegionArena}(\sigma ,\ \operatorname{RegionArena}(\sigma )[r\ \mapsto \ []])\ =\ \sigma '
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FreshAddr}(\sigma )\ =\ \mathsf{addr}\ \Rightarrow \ \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ \mathsf{undefined}\ \land \ \operatorname{AddrTags}(\sigma )(\mathsf{addr})\ \mathsf{undefined} \\[0.16em]
\operatorname{Prefix}([a_{0},\ \ldots ,\ a\_\{n-1\}],\ m)\ =\ [a_{0},\ \ldots ,\ a\_\{m-1\}]\quad (0\ \le \ m\ \le \ n)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ArenaAppend}(\sigma ,\ r,\ \mathsf{addr})\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ArenaAllocs}(\sigma ,\ r)\ =\ \mathsf{allocs}\ \land \ \operatorname{UpdateRegionArena}(\sigma ,\ \operatorname{RegionArena}(\sigma )[r\ \mapsto \ \mathsf{allocs}\ \mathbin{++} \ [\mathsf{addr}]])\ =\ \sigma ' \\[0.16em]
\operatorname{ArenaMark}(\sigma ,\ r)\ =\ m\ \Leftrightarrow \ \operatorname{ArenaAllocs}(\sigma ,\ r)\ =\ \mathsf{allocs}\ \land \ m\ =\ \mid \mathsf{allocs}\mid  \\[0.16em]
\operatorname{ArenaResetTo}(\sigma ,\ r,\ m)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ArenaAllocs}(\sigma ,\ r)\ =\ \mathsf{allocs}\ \land \ 0\ \le \ m\ \le \ \mid \mathsf{allocs}\mid \ \land \ \mathsf{allocs}'\ =\ \operatorname{Prefix}(\mathsf{allocs},\ m)\ \land \ \operatorname{UpdateRegionArena}(\sigma ,\ \operatorname{RegionArena}(\sigma )[r\ \mapsto \ \mathsf{allocs}'])\ =\ \sigma ' \\[0.16em]
\operatorname{ArenaClear}(\sigma ,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ArenaResetTo}(\sigma ,\ r,\ 0)\ \Downarrow \ \sigma ' \\[0.16em]
\operatorname{ArenaRemove}(\sigma ,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{RegionArena}(\sigma ')\ =\ \operatorname{RegionArena}(\sigma )\ \setminus \ \{r\}\ \land \ \operatorname{ScopeStack}(\sigma ')\ =\ \operatorname{ScopeStack}(\sigma )\ \land \ \operatorname{AddrTags}(\sigma ')\ =\ \operatorname{AddrTags}(\sigma )\ \land \ \operatorname{RegionStack}(\sigma ')\ =\ \operatorname{RegionStack}(\sigma )\ \land \ \operatorname{PoisonedModules}(\sigma ')\ =\ \operatorname{PoisonedModules}(\sigma )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RegionValue}(S,\ h)\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{Region}],\ S),\ [\langle \texttt{handle},\ \operatorname{IntVal}(\texttt{"usize"},\ h)\rangle ]) \\[0.16em]
\operatorname{RegionHandleOf}(v)\ =\ h\ \Leftrightarrow \ v\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{Region}],\ S),\ \mathsf{fs})\ \land \ \langle \texttt{handle},\ \operatorname{IntVal}(\texttt{"usize"},\ h)\rangle \ \in \ \mathsf{fs}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ResolveEntry}([],\ r)\ =\ \bot  \\[0.16em]
\operatorname{ResolveEntry}(e\ \mathbin{::} \ \mathsf{es},\ r)\ = \\[0.16em]
\ e\quad \mathsf{if}\ \operatorname{RegionTargetOf}(e)\ =\ r \\[0.16em]
\ \operatorname{ResolveEntry}(\mathsf{es},\ r)\ \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ActiveEntry}(\sigma )\ =\ e\ \Leftrightarrow \ \operatorname{RegionStack}(\sigma )\ =\ e\ \mathbin{::} \ \mathsf{es} \\[0.16em]
\operatorname{ActiveTarget}(\sigma )\ =\ \mathsf{target}\ \Leftrightarrow \ \operatorname{ActiveEntry}(\sigma )\ =\ e\ \land \ \operatorname{RegionTargetOf}(e)\ =\ \mathsf{target} \\[0.16em]
\operatorname{ResolveTarget}(\sigma ,\ r)\ =\ \mathsf{target}\ \Leftrightarrow \ \operatorname{ResolveEntry}(\operatorname{RegionStack}(\sigma ),\ r)\ =\ e\ \land \ \operatorname{RegionTargetOf}(e)\ =\ \mathsf{target} \\[0.16em]
\operatorname{ResolveTag}(\sigma ,\ r)\ =\ \mathsf{tag}\ \Leftrightarrow \ \operatorname{ResolveEntry}(\operatorname{RegionStack}(\sigma ),\ r)\ =\ e\ \land \ \operatorname{RegionTagOf}(e)\ =\ \mathsf{tag} \\[0.16em]
\operatorname{FreshTag}(\sigma )\ =\ \mathsf{tag}\ \Rightarrow \ \forall \ e\ \in \ \operatorname{RegionStack}(\sigma ).\ \operatorname{RegionTagOf}(e)\ \ne \ \mathsf{tag} \\[0.16em]
\operatorname{FreshArena}(\sigma )\ =\ r\ \Rightarrow \ \forall \ e\ \in \ \operatorname{RegionStack}(\sigma ).\ \operatorname{RegionTargetOf}(e)\ \ne \ r
\end{array}
$$

$$
\operatorname{UpdateRegionStack}(\sigma ,\ \mathsf{rs})\ =\ \sigma '\ \Leftrightarrow \ \operatorname{RegionStack}(\sigma ')\ =\ \mathsf{rs}\ \land \ \operatorname{ScopeStack}(\sigma ')\ =\ \operatorname{ScopeStack}(\sigma )\ \land \ \operatorname{AddrTags}(\sigma ')\ =\ \operatorname{AddrTags}(\sigma )\ \land \ \operatorname{RegionArena}(\sigma ')\ =\ \operatorname{RegionArena}(\sigma )\ \land \ \operatorname{PoisonedModules}(\sigma ')\ =\ \operatorname{PoisonedModules}(\sigma )
$$

$$
\begin{array}{l}
\operatorname{RegionNew}(\sigma ,\ \mathsf{opts})\ \Downarrow \ (\sigma ',\ r,\ \mathsf{scope})\ \Leftrightarrow \ \mathsf{PushScope}\_\sigma (\sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ \operatorname{FreshArena}(\sigma )\ =\ r\ \land \ \operatorname{ArenaNew}(\sigma_{1} ,\ r)\ \Downarrow \ \sigma_{2} \ \land \ \operatorname{UpdateRegionStack}(\sigma_{2} ,\ \langle r,\ r,\ \mathsf{scope},\ \bot \rangle \ \mathbin{::} \ \operatorname{RegionStack}(\sigma_{2} ))\ =\ \sigma ' \\[0.16em]
\operatorname{RegionOpen}(\sigma ,\ \mathsf{opts})\ \Downarrow \ (\sigma ',\ r)\ \Leftrightarrow \ \operatorname{FreshArena}(\sigma )\ =\ r\ \land \ \operatorname{ArenaNew}(\sigma ,\ r)\ \Downarrow \ \sigma_{1} \ \land \ \operatorname{UpdateRegionStack}(\sigma_{1} ,\ \langle r,\ r,\ \operatorname{CurrentScopeId}(\sigma ),\ \bot \rangle \ \mathbin{::} \ \operatorname{RegionStack}(\sigma_{1} ))\ =\ \sigma ' \\[0.16em]
\operatorname{FrameEnter}(\sigma ,\ r)\ \Downarrow \ (\sigma ',\ F,\ \mathsf{scope},\ \mathsf{mark})\ \Leftrightarrow \ \mathsf{PushScope}\_\sigma (\sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ F\ =\ \operatorname{FreshTag}(\sigma )\ \land \ \mathsf{mark}\ =\ \operatorname{FrameMark}(\sigma_{1} ,\ r)\ \land \ \operatorname{UpdateRegionStack}(\sigma_{1} ,\ \langle F,\ r,\ \mathsf{scope},\ \mathsf{mark}\rangle \ \mathbin{::} \ \operatorname{RegionStack}(\sigma_{1} ))\ =\ \sigma '
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BindRegionAlias}(\sigma ,\ \bot ,\ r)\ \Downarrow \ \sigma  \\[0.16em]
\operatorname{BindRegionAlias}(\sigma ,\ x,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{BindVal}(\sigma ,\ x,\ \operatorname{RegionValue}(\texttt{@Active},\ r))\ \Downarrow \ (\sigma ',\ b)
\end{array}
$$

$$
\operatorname{TagAddr}(\sigma ,\ \mathsf{addr},\ \mathsf{tag})\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{AddrTags}(\sigma ')\ =\ \operatorname{AddrTags}(\sigma )[\mathsf{addr}\ \mapsto \ \mathsf{tag}]\ \land \ \operatorname{ScopeStack}(\sigma ')\ =\ \operatorname{ScopeStack}(\sigma )\ \land \ \operatorname{RegionStack}(\sigma ')\ =\ \operatorname{RegionStack}(\sigma )\ \land \ \operatorname{RegionArena}(\sigma ')\ =\ \operatorname{RegionArena}(\sigma )\ \land \ \operatorname{PoisonedModules}(\sigma ')\ =\ \operatorname{PoisonedModules}(\sigma )
$$

$$
\operatorname{TagAddrFrom}(\sigma ,\ \mathsf{base},\ \mathsf{addr})\ \Downarrow \ \sigma '\ \Leftrightarrow \ (\operatorname{AddrTag}(\sigma ,\ \mathsf{base})\ =\ \mathsf{tag}\ \land \ \operatorname{TagAddr}(\sigma ,\ \mathsf{addr},\ \mathsf{tag})\ \Downarrow \ \sigma ')\ \lor \ (\operatorname{AddrTag}(\sigma ,\ \mathsf{base})\ =\ \bot \ \land \ \sigma '\ =\ \sigma )
$$

$$
\operatorname{RegionAlloc}(\sigma ,\ r,\ v)\ \Downarrow \ (\sigma ',\ v')\ \Leftrightarrow \ \operatorname{ResolveTag}(\sigma ,\ r)\ =\ \mathsf{tag}\ \land \ \operatorname{FreshAddr}(\sigma )\ =\ \mathsf{addr}\ \land \ \operatorname{WriteAddr}(\sigma ,\ \mathsf{addr},\ v)\ \Downarrow \ \sigma_{1} \ \land \ \operatorname{ArenaAppend}(\sigma_{1} ,\ r,\ \mathsf{addr})\ \Downarrow \ \sigma_{2} \ \land \ \operatorname{TagAddr}(\sigma_{2} ,\ \mathsf{addr},\ \operatorname{RegionTag}(\mathsf{tag}))\ \Downarrow \ \sigma '\ \land \ \operatorname{ReadAddr}(\sigma ',\ \mathsf{addr})\ =\ v'
$$

$$
\operatorname{FreshTags}(\sigma ,\ \mathsf{tags})\ \Leftrightarrow \ \operatorname{Distinct}(\mathsf{tags})\ \land \ \forall \ \mathsf{tag}\ \in \ \operatorname{Set}(\mathsf{tags}).\ \forall \ e\ \in \ \operatorname{RegionStack}(\sigma ).\ \operatorname{RegionTagOf}(e)\ \ne \ \mathsf{tag}
$$

$$
\begin{array}{l}
\operatorname{RetagRegions}([],\ r,\ \mathsf{tags})\ =\ []\ \Leftrightarrow \ \mathsf{tags}\ =\ [] \\[0.16em]
\operatorname{RetagRegions}(e\ \mathbin{::} \ \mathsf{es},\ r,\ \mathsf{tags})\ = \\[0.16em]
\ e'\ \mathbin{::} \ \operatorname{RetagRegions}(\mathsf{es},\ r,\ \mathsf{tags}')\quad \mathsf{if}\ \operatorname{RegionTargetOf}(e)\ =\ r\ \land \ \mathsf{tags}\ =\ \mathsf{tag}\ \mathbin{::} \ \mathsf{tags}'\ \land \ e'\ =\ \langle \mathsf{tag},\ \operatorname{RegionTargetOf}(e),\ \operatorname{RegionScopeOf}(e),\ \operatorname{RegionMarkOf}(e)\rangle  \\[0.16em]
\ e\ \mathbin{::} \ \operatorname{RetagRegions}(\mathsf{es},\ r,\ \mathsf{tags})\quad \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{RegionReset}(\sigma ,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ArenaClear}(\sigma ,\ r)\ \Downarrow \ \sigma_{1} \ \land \ \operatorname{FreshTags}(\sigma_{1} ,\ \mathsf{tags})\ \land \ \operatorname{RetagRegions}(\operatorname{RegionStack}(\sigma_{1} ),\ r,\ \mathsf{tags})\ =\ \mathsf{rs}'\ \land \ \operatorname{UpdateRegionStack}(\sigma_{1} ,\ \mathsf{rs}')\ =\ \sigma '
$$

$$
\begin{array}{l}
\operatorname{PopRegions}([],\ r)\ =\ [] \\[0.16em]
\operatorname{PopRegions}(e\ \mathbin{::} \ \mathsf{es},\ r)\ = \\[0.16em]
\ \operatorname{PopRegions}(\mathsf{es},\ r)\quad \mathsf{if}\ \operatorname{RegionTargetOf}(e)\ =\ r \\[0.16em]
\ e\ \mathbin{::} \ \operatorname{PopRegions}(\mathsf{es},\ r)\quad \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{RegionFree}(\sigma ,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ArenaRemove}(\sigma ,\ r)\ \Downarrow \ \sigma_{1} \ \land \ \operatorname{PopRegions}(\operatorname{RegionStack}(\sigma_{1} ),\ r)\ =\ \mathsf{rs}'\ \land \ \operatorname{UpdateRegionStack}(\sigma_{1} ,\ \mathsf{rs}')\ =\ \sigma '
$$

$$
\begin{array}{l}
\operatorname{FrameMark}(\sigma ,\ r)\ =\ \operatorname{ArenaMark}(\sigma ,\ r) \\[0.16em]
\operatorname{PopRegionScope}([],\ \mathsf{scope})\ =\ \bot  \\[0.16em]
\operatorname{PopRegionScope}(e\ \mathbin{::} \ \mathsf{es},\ \mathsf{scope})\ = \\[0.16em]
\ \{\ \mathsf{es}\quad \mathsf{if}\ \operatorname{RegionScopeOf}(e)\ =\ \mathsf{scope} \\[0.16em]
\quad \operatorname{PopRegionScope}(\mathsf{es},\ \mathsf{scope})\ \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{ReleaseArena}(\sigma ,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{RegionFree}(\sigma ,\ r)\ \Downarrow \ \sigma ' \\[0.16em]
\operatorname{ResetArena}(\sigma ,\ r,\ \mathsf{scope},\ \mathsf{mark})\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ArenaResetTo}(\sigma ,\ r,\ \mathsf{mark})\ \Downarrow \ \sigma_{1} \ \land \ \operatorname{PopRegionScope}(\operatorname{RegionStack}(\sigma_{1} ),\ \mathsf{scope})\ =\ \mathsf{rs}'\ \land \ \operatorname{UpdateRegionStack}(\sigma_{1} ,\ \mathsf{rs}')\ =\ \sigma '
\end{array}
$$

Cleanup, unwinding, initialization, deinitialization, and interpreter entry are defined in Chapter 24. This chapter defines only the dynamic scope-stack, binding-store, and region-runtime machinery those sections consume.

### 6.5.3 Runtime Value, Block, and Address Helpers

**Region Deallocation Order.**
`RegionRelease` and `FrameReset` MUST execute `CleanupScope` before any `ArenaResetTo` or `ArenaRemove`.
`ArenaResetTo`, `ArenaClear`, and `ArenaRemove` MUST NOT invoke `Drop`; they only reclaim arena storage.

$$
\mathsf{RegionProcJudg}\ =\ \{\operatorname{RegionNewScoped}(\sigma ,\ \mathsf{opts})\ \Downarrow \ (\sigma ',\ v),\ \operatorname{RegionAllocProc}(\sigma ,\ v_{r},\ v)\ \Downarrow \ (\sigma ',\ v'),\ \operatorname{RegionResetProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v'),\ \operatorname{RegionFreezeProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v'),\ \operatorname{RegionThawProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v'),\ \operatorname{RegionFreeProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v')\}
$$

**(Region-New-Scoped)**

$$
\begin{array}{l}
\operatorname{RegionOpen}(\sigma ,\ \mathsf{opts})\ \Downarrow \ (\sigma ',\ r)\quad v\ =\ \operatorname{RegionValue}(\texttt{@Active},\ r) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RegionNewScoped}(\sigma ,\ \mathsf{opts})\ \Downarrow \ (\sigma ',\ v)
\end{array}
$$

**(Region-Alloc-Proc)**

$$
\begin{array}{l}
\operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{ResolveTarget}(\sigma ,\ h)\ =\ r_{t}\quad \operatorname{RegionAlloc}(\sigma ,\ r_{t},\ v)\ \Downarrow \ (\sigma ',\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RegionAllocProc}(\sigma ,\ v_{r},\ v)\ \Downarrow \ (\sigma ',\ v')
\end{array}
$$

**(Region-Reset-Proc)**

$$
\begin{array}{l}
\operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{RegionReset}(\sigma ,\ h)\ \Downarrow \ \sigma '\quad v'\ =\ \operatorname{RegionValue}(\texttt{@Active},\ h) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RegionResetProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v')
\end{array}
$$

**(Region-Freeze-Proc)**

$$
\begin{array}{l}
\operatorname{RegionHandleOf}(v_{r})\ =\ h\quad v'\ =\ \operatorname{RegionValue}(\texttt{@Frozen},\ h) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RegionFreezeProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ,\ v')
\end{array}
$$

**(Region-Thaw-Proc)**

$$
\begin{array}{l}
\operatorname{RegionHandleOf}(v_{r})\ =\ h\quad v'\ =\ \operatorname{RegionValue}(\texttt{@Active},\ h) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RegionThawProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ,\ v')
\end{array}
$$

**(Region-Free-Proc)**

$$
\begin{array}{l}
\operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{RegionFree}(\sigma ,\ h)\ \Downarrow \ \sigma '\quad v'\ =\ \operatorname{RegionValue}(\texttt{@Freed},\ h) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RegionFreeProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v')
\end{array}
$$

$$
\operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma ',\ \mathsf{scope})\ \Leftrightarrow \ \mathsf{PushScope}\_\sigma (\sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ \exists \ \mathsf{bs}.\ \operatorname{BindList}(\sigma_{1} ,\ \mathsf{binds})\ \Downarrow \ (\sigma ',\ \mathsf{bs})
$$

$$
\begin{array}{l}
\operatorname{BoolVal}(b)\ =\ b\ \Leftrightarrow \ b\ \in \ \{\mathsf{true},\ \mathsf{false}\} \\[0.16em]
\operatorname{CharVal}(u)\ =\ u\ \Leftrightarrow \ u\ \in \ \mathsf{UnicodeScalar} \\[0.16em]
\mathsf{UnitVal}\ =\ () \\[0.16em]
\operatorname{IntVal}(t,\ x)\ \mathsf{defined}\ \Leftrightarrow \ t\ \in \ \mathsf{IntTypes}\ \land \ \operatorname{InRange}(x,\ t) \\[0.16em]
\operatorname{IntValType}(\operatorname{IntVal}(t,\ x))\ =\ t \\[0.16em]
\operatorname{IntValValue}(\operatorname{IntVal}(t,\ x))\ =\ x \\[0.16em]
\operatorname{FloatVal}(t,\ v)\ \mathsf{defined}\ \Leftrightarrow \ t\ \in \ \mathsf{FloatTypes}\ \land \ v\ \in \ \operatorname{FloatValueSet}(t) \\[0.16em]
\operatorname{FloatValType}(\operatorname{FloatVal}(t,\ v))\ =\ t \\[0.16em]
\operatorname{FloatValValue}(\operatorname{FloatVal}(t,\ v))\ =\ v \\[0.16em]
\operatorname{PtrVal}(s,\ \mathsf{addr})\ \mathsf{defined}\ \Leftrightarrow \ s\ \in \ \mathsf{PtrStateSet} \\[0.16em]
\mathsf{TupleVal}\ =\ \{(v_{1},\ \ldots ,\ v_{n})\ \mid \ n\ \ge \ 0\} \\[0.16em]
\mathsf{ArrayVal}\ =\ \{[v_{1},\ \ldots ,\ v_{n}]\ \mid \ n\ \ge \ 0\} \\[0.16em]
\operatorname{FuncVal}(\mathsf{sym})\ \mathsf{defined}\ \Leftrightarrow \ \mathsf{sym}\ \in \ \mathsf{Symbol} \\[0.16em]
\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}})\ \mathsf{defined}\ \Leftrightarrow \ (\mathsf{env}_{\mathsf{ptr}}\ =\ \mathsf{null}\ \lor \ \mathsf{env}_{\mathsf{ptr}}\ \in \ \mathsf{Addr})\ \land \ \mathsf{code}_{\mathsf{ptr}}\ \in \ \mathsf{Symbol} \\[0.16em]
\mathsf{RangeVal}\ =\ \{\operatorname{RangeVal}(k,\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}})\ \mid \ k\ \in \ \mathsf{RangeKind}\} \\[0.16em]
\operatorname{ModalVal}(S,\ v)\ =\ \langle S,\ v\rangle 
\end{array}
$$
RecordValue(tr, fs) defined

$$
\begin{array}{l}
\mathsf{EnumPayloadVal}\ =\ \{\bot ,\ \operatorname{TuplePayload}(\mathsf{vec}_{v}),\ \operatorname{RecordPayload}(\mathsf{vec}_{f})\} \\[0.16em]
\operatorname{EnumValue}(\mathsf{path},\ \mathsf{payload})\ \mathsf{defined}\ \Leftrightarrow \ \mathsf{payload}\ \in \ \mathsf{EnumPayloadVal} \\[0.16em]
\operatorname{SliceValue}(v,\ r)\ \mathsf{defined}\ \Leftrightarrow \ \operatorname{SliceBounds}(r,\ \operatorname{Len}(v))\ \mathsf{defined} \\[0.16em]
\mathsf{Value}\ =\ \{\operatorname{BoolVal}(b)\ \mid \ b\ \in \ \{\mathsf{true},\ \mathsf{false}\}\}\ \cup \ \{\operatorname{CharVal}(u)\ \mid \ u\ \in \ \mathsf{UnicodeScalar}\}\ \cup \ \{\mathsf{UnitVal}\}\ \cup \ \{\operatorname{IntVal}(t,\ x)\ \mid \ \operatorname{IntVal}(t,\ x)\ \mathsf{defined}\}\ \cup \ \{\operatorname{FloatVal}(t,\ v)\ \mid \ \operatorname{FloatVal}(t,\ v)\ \mathsf{defined}\}\ \cup \ \{\operatorname{PtrVal}(s,\ \mathsf{addr})\ \mid \ \operatorname{PtrVal}(s,\ \mathsf{addr})\ \mathsf{defined}\}\ \cup \ \{\operatorname{RawPtr}(q,\ \mathsf{addr})\}\ \cup \ \mathsf{TupleVal}\ \cup \ \mathsf{ArrayVal}\ \cup \ \{\operatorname{RecordValue}(\mathsf{tr},\ \mathsf{fs})\}\ \cup \ \{\operatorname{EnumValue}(\mathsf{path},\ \mathsf{payload})\}\ \cup \ \mathsf{RangeVal}\ \cup \ \{\operatorname{SliceValue}(v,\ r)\ \mid \ \operatorname{SliceValue}(v,\ r)\ \mathsf{defined}\}\ \cup \ \{\operatorname{ModalVal}(S,\ v)\}\ \cup \ \{\operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ T)\}\ \cup \ \texttt{string@Managed}\ \cup \ \texttt{string@View}\ \cup \ \texttt{bytes@Managed}\ \cup \ \texttt{bytes@View}\ \cup \ \{\operatorname{FuncVal}(\mathsf{sym})\}\ \cup \ \{\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}})\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TupleValue}((v_{0},\ \ldots ,\ v\_\{n-1\}),\ i)\ =\ v_{i}\quad (0\ \le \ i\ <\ n) \\[0.16em]
\operatorname{TupleUpdate}((v_{0},\ \ldots ,\ v\_\{n-1\}),\ i,\ v')\ =\ (v_{0},\ \ldots ,\ v\_\{i-1\},\ v',\ v\_\{i+1\},\ \ldots ,\ v\_\{n-1\})\quad (0\ \le \ i\ <\ n) \\[0.16em]
\operatorname{FieldValue}(\operatorname{RecordValue}(\mathsf{tr},\ \mathsf{fs}),\ f)\ =\ v\ \Leftrightarrow \ \langle f,\ v\rangle \ \in \ \mathsf{fs} \\[0.16em]
\operatorname{FieldUpdate}(\operatorname{RecordValue}(\mathsf{tr},\ \mathsf{fs}),\ f,\ v')\ =\ \operatorname{RecordValue}(\mathsf{tr},\ \mathsf{fs}')\quad \mathsf{where}\ \mathsf{fs}'\ =\ [\langle f_{i},\ v_{i}'\rangle \ \mid \ \langle f_{i},\ v_{i}\rangle \ \in \ \mathsf{fs}\ \land \ v_{i}'\ =\ v'\ \mathsf{if}\ f_{i}\ =\ f\ \mathsf{otherwise}\ v_{i}] \\[0.16em]
\operatorname{IndexUpdate}([v_{0},\ \ldots ,\ v\_\{n-1\}],\ i,\ v_{e})\ =\ [v_{0},\ \ldots ,\ v\_\{i-1\},\ v_{e},\ v\_\{i+1\},\ \ldots ,\ v\_\{n-1\}]\quad (0\ \le \ i\ <\ n) \\[0.16em]
\operatorname{SliceLen}([v_{0},\ \ldots ,\ v\_\{n-1\}])\ =\ n \\[0.16em]
\operatorname{SliceLen}(\operatorname{SliceValue}(v,\ r))\ =\ \mathsf{end}\ -\ \mathsf{start}\quad (\operatorname{SliceBounds}(r,\ \operatorname{Len}(v))\ =\ (\mathsf{start},\ \mathsf{end})) \\[0.16em]
\operatorname{SliceElem}(v,\ i)\ =\ \operatorname{IndexValue}(v,\ i)\quad (\operatorname{IndexValue}(v,\ i)\ \mathsf{defined}) \\[0.16em]
\operatorname{SliceUpdate}(v,\ \mathsf{start},\ v_{\mathsf{rhs}})\ \Downarrow \ v'\ \Leftrightarrow \ n\ =\ \operatorname{SliceLen}(v_{\mathsf{rhs}})\ \land \ \exists \ v_{0},\ \ldots ,\ v_{n}.\ v_{0}\ =\ v\ \land \ \forall \ i\ \in \ [0,\ n-1].\ v\_\{i+1\}\ =\ \operatorname{IndexUpdate}(v_{i},\ \mathsf{start}\ +\ i,\ \operatorname{SliceElem}(v_{\mathsf{rhs}},\ i))\ \land \ v'\ =\ v_{n}
\end{array}
$$

$$
\mathsf{AddrPrimJudg}\ =\ \{\operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v,\ \operatorname{WriteAddr}(\sigma ,\ \mathsf{addr},\ v)\ \Downarrow \ \sigma ',\ \operatorname{FieldAddr}(T,\ \mathsf{addr},\ f)\ =\ \mathsf{addr}',\ \operatorname{TupleAddr}(T,\ \mathsf{addr},\ i)\ =\ \mathsf{addr}',\ \operatorname{IndexAddr}(T_{b},\ \mathsf{addr},\ i)\ =\ \mathsf{addr}'\}
$$

$$
\begin{array}{l}
\operatorname{AddrAdd}(\mathsf{addr},\ n)\ =\ \mathsf{addr}\ +\ n \\[0.16em]
\operatorname{ElemType}(T_{b})\ =\ T\ \Leftrightarrow \ \operatorname{StripPerm}(T_{b})\ =\ \operatorname{TypeArray}(T,\ \_)\ \lor \ \operatorname{StripPerm}(T_{b})\ =\ \operatorname{TypeSlice}(T) \\[0.16em]
\operatorname{FieldAddr}(T,\ \mathsf{addr},\ f)\ =\ \operatorname{AddrAdd}(\mathsf{addr},\ \operatorname{FieldOffset}(\operatorname{Fields}(R),\ f))\quad \mathsf{when}\ \operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R \\[0.16em]
\operatorname{TupleAddr}(T,\ \mathsf{addr},\ i)\ =\ \operatorname{AddrAdd}(\mathsf{addr},\ \operatorname{FieldOffset}(\operatorname{TupleFields}([T_{1},\ \ldots ,\ T_{n}]),\ i))\quad \mathsf{when}\ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]) \\[0.16em]
\operatorname{IndexLen}(\sigma ,\ \mathsf{addr})\ =\ \operatorname{Len}(v)\quad (\operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v\ \land \ \operatorname{Len}(v)\ \mathsf{defined}) \\[0.16em]
\operatorname{IndexAddr}(T_{b},\ \mathsf{addr},\ i)\ =\ \operatorname{AddrAdd}(\mathsf{addr},\ i\ \times \ \operatorname{sizeof}(\operatorname{ElemType}(T_{b})))\quad (\operatorname{ElemType}(T_{b})\ \mathsf{defined}) \\[0.16em]
\operatorname{IndexAddr}(T_{b},\ \mathsf{addr},\ v_{i})\ =\ \mathsf{addr}'\ \Leftrightarrow \ \operatorname{IndexNum}(v_{i})\ =\ i\ \land \ \operatorname{IndexAddr}(T_{b},\ \mathsf{addr},\ i)\ =\ \mathsf{addr}' \\[0.16em]
\operatorname{SliceLenFromAddr}(\sigma ,\ \mathsf{addr})\ =\ n\ \Leftrightarrow \ \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v\ \land \ \operatorname{SliceLen}(v)\ =\ n
\end{array}
$$

$$
\begin{array}{l}
\mathsf{PtrStateSet}\ =\ \{\texttt{Valid},\ \texttt{Null},\ \texttt{Expired}\} \\[0.16em]
\mathsf{RawQual}\ =\ \{\texttt{imm},\ \texttt{mut}\} \\[0.16em]
\operatorname{PtrAddr}(\mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr}))\ =\ \mathsf{addr} \\[0.16em]
\operatorname{PtrAddr}(\mathsf{Ptr}@\operatorname{Null}(\mathsf{addr}))\ =\ \mathsf{addr} \\[0.16em]
\operatorname{PtrAddr}(\mathsf{Ptr}@\operatorname{Expired}(\mathsf{addr}))\ =\ \mathsf{addr} \\[0.16em]
\operatorname{PtrAddr}(\operatorname{RawPtr}(q,\ \mathsf{addr}))\ =\ \mathsf{addr}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BindAddr}(\langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ \in \ \mathsf{Addr} \\[0.16em]
\operatorname{AddrOfBind}(b)\ = \\[0.16em]
\ \{\ \mathsf{addr}\quad \mathsf{if}\ \operatorname{BindingValue}(\sigma ,\ b)\ =\ \operatorname{Alias}(\mathsf{addr}) \\[0.16em]
\quad \operatorname{BindAddr}(b)\ \mathsf{if}\ \operatorname{BindingValue}(\sigma ,\ b)\ \ne \ \operatorname{Alias}(\_)\ \} \\[0.16em]
\operatorname{AddrOfBind}(x)\ =\ \mathsf{addr}\ \Leftrightarrow \ \exists \ b.\ \operatorname{LookupBind}(\sigma ,\ x)\ =\ b\ \land \ \operatorname{AddrOfBind}(b)\ =\ \mathsf{addr}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ = \\[0.16em]
\ \{\ \operatorname{ScopeTag}(\mathsf{sid})\quad \mathsf{if}\ \mathsf{addr}\ =\ \operatorname{BindAddr}(\langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle ) \\[0.16em]
\quad \operatorname{RegionTag}(\mathsf{tag})\ \mathsf{if}\ \operatorname{AddrTags}(\sigma )(\mathsf{addr})\ =\ \operatorname{RegionTag}(\mathsf{tag}) \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{TagActive}(\sigma ,\ \operatorname{RegionTag}(\mathsf{tag}))\ \Leftrightarrow \ \exists \ e\ \in \ \operatorname{RegionStack}(\sigma ).\ \operatorname{RegionTagOf}(e)\ =\ \mathsf{tag} \\[0.16em]
\operatorname{TagActive}(\sigma ,\ \operatorname{ScopeTag}(\mathsf{sid}))\ \Leftrightarrow \ \exists \ e\ \in \ \operatorname{ScopeStack}(\sigma ).\ \operatorname{ScopeId}(e)\ =\ \mathsf{sid} \\[0.16em]
\operatorname{DynAddrState}(\sigma ,\ \mathsf{addr})\ = \\[0.16em]
\ \{\ \texttt{Valid}\quad \mathsf{if}\ \operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ =\ \bot  \\[0.16em]
\quad \texttt{Valid}\quad \mathsf{if}\ \operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ =\ \mathsf{tag}\ \ne \ \bot \ \land \ \operatorname{TagActive}(\sigma ,\ \mathsf{tag}) \\[0.16em]
\quad \texttt{Expired}\ \mathsf{if}\ \operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ =\ \mathsf{tag}\ \ne \ \bot \ \land \ \lnot \ \operatorname{TagActive}(\sigma ,\ \mathsf{tag})\ \}
\end{array}
$$

## 6.6 Runtime State and Memory Diagnostics

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
