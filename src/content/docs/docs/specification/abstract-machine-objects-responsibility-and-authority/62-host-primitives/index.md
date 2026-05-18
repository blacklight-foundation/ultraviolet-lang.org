---
title: "6.2 Host Primitives"
description: "6.2 Host Primitives from 6. Abstract Machine, Objects, Responsibility, and Authority of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "abstract-machine-objects-responsibility-and-authority"
specSection: "62-host-primitives"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/">6. Abstract Machine, Objects, Responsibility, and Authority</a>
  <span>Abstract Machine, Objects, Responsibility, and Authority</span>
</div>

## 6.2 Host Primitives

$$
\begin{array}{l}
\mathsf{IOPrim}\ =\ \{\mathsf{IOOpenRead},\ \mathsf{IOOpenWrite},\ \mathsf{IOOpenAppend},\ \mathsf{IOCreateWrite},\ \mathsf{IOReadFile},\ \mathsf{IOReadBytes},\ \mathsf{IOWriteFile},\ \mathsf{IOWriteStdout},\ \mathsf{IOWriteStderr},\ \mathsf{IOExists},\ \mathsf{IORemove},\ \mathsf{IOOpenDir},\ \mathsf{IOCreateDir},\ \mathsf{IOEnsureDir},\ \mathsf{IOKind},\ \mathsf{IORestrict}\} \\[0.16em]
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
\mathsf{HostPrim}\ =\ \{\mathsf{ParseTOML},\ \mathsf{ReadBytes},\ \mathsf{WriteFile},\ \mathsf{ResolveTool},\ \mathsf{ResolveRuntimeLib},\ \mathsf{Invoke},\ \mathsf{AssembleIR},\ \mathsf{InvokeLinker},\ \mathsf{InvokeArchiver},\ \mathsf{ArchiveMembers}\}\ \cup \ \mathsf{IOPrim}\ \cup \ \mathsf{FilePrim}\ \cup \ \mathsf{DirPrim}\ \cup \ \mathsf{SystemPrim}\ \cup \ \mathsf{NetworkPrim}\ \cup \ \mathsf{HeapPrim}\ \cup \ \mathsf{ReactorPrim}\ \cup \ \mathsf{TimePrim}\ \cup \ \mathsf{CancelPrim} \\[0.16em]
\mathsf{HostPrimDiag}\ =\ \{\mathsf{ParseTOML},\ \mathsf{ReadBytes},\ \mathsf{WriteFile},\ \mathsf{ResolveTool},\ \mathsf{ResolveRuntimeLib},\ \mathsf{Invoke},\ \mathsf{AssembleIR},\ \mathsf{InvokeLinker},\ \mathsf{InvokeArchiver},\ \mathsf{ArchiveMembers}\} \\[0.16em]
\mathsf{HostPrimRuntime}\ =\ \mathsf{IOPrim}\ \cup \ \mathsf{FilePrim}\ \cup \ \mathsf{DirPrim}\ \cup \ \mathsf{SystemPrim}\ \cup \ \mathsf{NetworkPrim}\ \cup \ \mathsf{HeapPrim}\ \cup \ \mathsf{ReactorPrim}\ \cup \ \mathsf{TimePrim}\ \cup \ \mathsf{CancelPrim}
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

### 6.2.1 IO, File, and Directory Primitive Relations

Feature-local runtime behavior for capability-bearing IO operations is owned here. The built-in capability and modal declarations in Chapters 13 and 14 define the type surface; this section defines the runtime relations they invoke.

$$
\begin{array}{l}
\mathsf{IOJudg}\ =\ \{\operatorname{IOOpenRead}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{IOOpenWrite}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{IOOpenAppend}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{IOCreateWrite}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{IOReadFile}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{IOReadBytes}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{IOWriteFile}(\mathsf{io},\ \mathsf{path},\ \mathsf{data})\ \Downarrow \ r,\ \operatorname{IOWriteStdout}(\mathsf{io},\ \mathsf{data})\ \Downarrow \ r,\ \operatorname{IOWriteStderr}(\mathsf{io},\ \mathsf{data})\ \Downarrow \ r,\ \operatorname{IOExists}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ b,\ \operatorname{IORemove}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{IOOpenDir}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{IOCreateDir}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{IOEnsureDir}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{IOKind}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r,\ \operatorname{IORestrict}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ \mathsf{io}',\ \operatorname{FileReadAll}(\mathsf{handle})\ \Downarrow \ r,\ \operatorname{FileReadAllBytes}(\mathsf{handle})\ \Downarrow \ r,\ \operatorname{FileWrite}(\mathsf{handle},\ \mathsf{data})\ \Downarrow \ r,\ \operatorname{FileFlush}(\mathsf{handle})\ \Downarrow \ r,\ \operatorname{FileClose}(\mathsf{handle})\ \Downarrow \ \mathsf{ok},\ \operatorname{DirNext}(\mathsf{handle})\ \Downarrow \ r,\ \operatorname{DirClose}(\mathsf{handle})\ \Downarrow \ \mathsf{ok}\} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOOpenRead})\ =\ \texttt{Outcome<File@Read, IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOOpenWrite})\ =\ \texttt{Outcome<File@Write, IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOOpenAppend})\ =\ \texttt{Outcome<File@Append, IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOCreateWrite})\ =\ \texttt{Outcome<File@Write, IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOReadFile})\ =\ \texttt{Outcome<unique string@Managed, IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOReadBytes})\ =\ \texttt{Outcome<unique bytes@Managed, IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOWriteFile})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOWriteStdout})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOWriteStderr})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOExists})\ =\ \texttt{bool} \\[0.16em]
\operatorname{IOResType}(\mathsf{IORemove})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOOpenDir})\ =\ \texttt{Outcome<DirIter@Open, IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOCreateDir})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOEnsureDir})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IOKind})\ =\ \texttt{Outcome<FileKind, IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{IORestrict})\ =\ \texttt{\$IO} \\[0.16em]
\operatorname{IOResType}(\mathsf{FileReadAll})\ =\ \texttt{Outcome<unique string@Managed, IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{FileReadAllBytes})\ =\ \texttt{Outcome<unique bytes@Managed, IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{FileWrite})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{FileFlush})\ =\ \texttt{Outcome<(), IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{FileClose})\ =\ \texttt{ok} \\[0.16em]
\operatorname{IOResType}(\mathsf{DirNext})\ =\ \texttt{Outcome<DirEntry | (), IoError>} \\[0.16em]
\operatorname{IOResType}(\mathsf{DirClose})\ =\ \texttt{ok}
\end{array}
$$

When `IOResType(Op) = Outcome<T, E>`, a primitive relation in this section that
returns a successful payload `v` denotes `Outcome<T, E>@Value{value: v}`.
A primitive relation that returns an `IoError` value `e` denotes
`Outcome<T, IoError>@Error{error: e}`. For `DirNext`, the successful payload
type is `DirEntry | ()`, so exhausted iteration returns the `()` member inside
`Outcome<DirEntry | (), IoError>@Value`.

$$
\begin{array}{l}
\mathsf{Handle}\ =\ \mathbb{N}  \\[0.16em]
\mathsf{Entry}\ \mathbin{::} =\ \operatorname{FileEntry}(\mathsf{bytes})\ \mid \ \operatorname{DirEntry}(\mathsf{names})\ \mid \ \mathsf{OtherEntry} \\[0.16em]
\mathsf{IOState}\ =\ \langle \mathsf{entries},\ \mathsf{handles},\ \mathsf{diriters},\ \mathsf{flushed},\ \mathsf{failmap}\rangle  \\[0.16em]
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
\operatorname{DirIterIO}(\omega ,\ h)\ = \\[0.16em]
\ \operatorname{DirIters}(\omega )[h].\mathsf{io}\ \mathsf{if}\ \operatorname{DirIters}(\omega )[h]\ \mathsf{defined} \\[0.16em]
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
\mathsf{IOJudg}\_\omega \ =\ \{\operatorname{IOOpenRead}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOOpenWrite}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOOpenAppend}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOCreateWrite}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOReadFile}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOReadBytes}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOWriteFile}(\mathsf{io},\ \mathsf{path},\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOWriteStdout}(\mathsf{io},\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOWriteStderr}(\mathsf{io},\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOExists}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (b,\ \omega '),\ \operatorname{IORemove}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOOpenDir}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOCreateDir}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOEnsureDir}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{IOKind}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ')\} \\[0.16em]
\mathsf{FileJudg}\_\omega \ =\ \{\operatorname{FileReadAll}(h,\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FileReadAllBytes}(h,\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FileWrite}(h,\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FileFlush}(h,\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{FileClose}(h,\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ')\} \\[0.16em]
\mathsf{DirJudg}\_\omega \ =\ \{\operatorname{DirNext}(h,\ \omega )\ \Downarrow \ (r,\ \omega '),\ \operatorname{DirClose}(h,\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ')\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IOOpenRead}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOOpenRead}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOOpenWrite}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOOpenWrite}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOOpenAppend}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOOpenAppend}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOCreateWrite}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOCreateWrite}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOReadFile}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOReadFile}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOReadBytes}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOReadBytes}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOWriteFile}(\mathsf{io},\ \mathsf{path},\ \mathsf{data})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOWriteFile}(\mathsf{io},\ \mathsf{path},\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOWriteStdout}(\mathsf{io},\ \mathsf{data})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOWriteStdout}(\mathsf{io},\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOWriteStderr}(\mathsf{io},\ \mathsf{data})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOWriteStderr}(\mathsf{io},\ \mathsf{data},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOExists}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ b\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOExists}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (b,\ \omega ') \\[0.16em]
\operatorname{IORemove}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IORemove}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOOpenDir}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOOpenDir}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOCreateDir}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOCreateDir}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOEnsureDir}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOEnsureDir}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
\operatorname{IOKind}(\mathsf{io},\ \mathsf{path})\ \Downarrow \ r\ \Leftrightarrow \ \exists \ \omega ,\ \omega '.\ \operatorname{IOKind}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ') \\[0.16em]
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
\mathsf{IOOp}\ =\ \{\mathsf{IOOpenRead},\ \mathsf{IOOpenWrite},\ \mathsf{IOOpenAppend},\ \mathsf{IOCreateWrite},\ \mathsf{IOReadFile},\ \mathsf{IOReadBytes},\ \mathsf{IOWriteFile},\ \mathsf{IOWriteStdout},\ \mathsf{IOWriteStderr},\ \mathsf{IOExists},\ \mathsf{IORemove},\ \mathsf{IOOpenDir},\ \mathsf{IOCreateDir},\ \mathsf{IOEnsureDir},\ \mathsf{IOKind}\} \\[0.16em]
\operatorname{IORestrict}(\mathsf{io},\ \mathsf{base})\ \Downarrow \ \mathsf{io}'\ \land \ \mathsf{Op}\ \in \ \mathsf{IOOp}\ \land \ \operatorname{RestrictPath}(\mathsf{base},\ p)\ =\ q\ \Rightarrow \ \operatorname{Op}(\mathsf{io}',\ p)\ =\ \operatorname{Op}(\mathsf{io},\ q) \\[0.16em]
\operatorname{IORestrict}(\mathsf{io},\ \mathsf{base})\ \Downarrow \ \mathsf{io}'\ \land \ \mathsf{Op}\ \in \ \mathsf{IOOp}\ \land \ \operatorname{RestrictPath}(\mathsf{base},\ p)\ =\ \bot \ \land \ \mathsf{Op}\ \ne \ \mathsf{IOExists}\ \Rightarrow \ \operatorname{Op}(\mathsf{io}',\ p)\ =\ \mathsf{IoError}\mathbin{::} \mathsf{InvalidPath} \\[0.16em]
\operatorname{IORestrict}(\mathsf{io},\ \mathsf{base})\ \Downarrow \ \mathsf{io}'\ \land \ \operatorname{RestrictPath}(\mathsf{base},\ p)\ =\ \bot \ \Rightarrow \ \operatorname{IOExists}(\mathsf{io}',\ p)\ =\ \mathsf{false}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{IOPathOp}_{0}\ =\ \{\mathsf{IOOpenRead},\ \mathsf{IOOpenWrite},\ \mathsf{IOOpenAppend},\ \mathsf{IOCreateWrite},\ \mathsf{IOReadFile},\ \mathsf{IOReadBytes},\ \mathsf{IORemove},\ \mathsf{IOOpenDir},\ \mathsf{IOCreateDir},\ \mathsf{IOEnsureDir},\ \mathsf{IOKind}\} \\[0.16em]
\mathsf{IOPathOp}_{1}\ =\ \{\mathsf{IOWriteFile}\} \\[0.16em]
\mathsf{IORequiresExisting}\ =\ \{\mathsf{IOOpenRead},\ \mathsf{IOOpenWrite},\ \mathsf{IOOpenAppend},\ \mathsf{IOReadFile},\ \mathsf{IOReadBytes},\ \mathsf{IOOpenDir},\ \mathsf{IOKind},\ \mathsf{IORemove}\} \\[0.16em]
\operatorname{PathInvalid}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Leftrightarrow \ \operatorname{Canon}(\operatorname{Normalize}(\mathsf{path}))\ =\ \bot  \\[0.16em]
\operatorname{EntryExists}(\omega ,\ \mathsf{path})\ \Leftrightarrow \ \operatorname{Entries}(\omega )[\mathsf{path}]\ \mathsf{defined} \\[0.16em]
\operatorname{PermissionDenied}(\mathsf{io},\ \mathsf{path},\ \mathsf{Op},\ \omega )\ \Leftrightarrow \ \operatorname{FailMap}(\omega )[\langle \mathsf{Op},\ \mathsf{path}\rangle ]\ =\ \mathsf{IoError}\mathbin{::} \mathsf{PermissionDenied} \\[0.16em]
\operatorname{Busy}(\mathsf{io},\ \mathsf{path},\ \mathsf{Op},\ \omega )\ \Leftrightarrow \ \operatorname{FailMap}(\omega )[\langle \mathsf{Op},\ \mathsf{path}\rangle ]\ =\ \mathsf{IoError}\mathbin{::} \mathsf{Busy} \\[0.16em]
\operatorname{OtherFailure}(\mathsf{io},\ \mathsf{path},\ \mathsf{Op},\ \omega )\ \Leftrightarrow \ \operatorname{FailMap}(\omega )[\langle \mathsf{Op},\ \mathsf{path}\rangle ]\ =\ \mathsf{IoError}\mathbin{::} \mathsf{IoFailure}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Op}\ \in \ \mathsf{IOPathOp}_{0}\ \land \ \operatorname{PathInvalid}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Rightarrow \ \operatorname{Op}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{InvalidPath},\ \omega ) \\[0.16em]
\mathsf{Op}\ \in \ \mathsf{IOPathOp}_{1}\ \land \ \operatorname{PathInvalid}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Rightarrow \ \operatorname{Op}(\mathsf{io},\ \mathsf{path},\ \mathsf{data},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{InvalidPath},\ \omega ) \\[0.16em]
\mathsf{Op}\ \in \ \mathsf{IORequiresExisting}\ \land \ \lnot \ \operatorname{EntryExists}(\omega ,\ \mathsf{path})\ \Rightarrow \ \operatorname{Op}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{NotFound},\ \omega ) \\[0.16em]
\operatorname{PermissionDenied}(\mathsf{io},\ \mathsf{path},\ \mathsf{Op},\ \omega )\ \Rightarrow \ \operatorname{Op}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{PermissionDenied},\ \omega ) \\[0.16em]
\mathsf{Op}\ =\ \mathsf{IOCreateWrite}\ \land \ \operatorname{EntryExists}(\omega ,\ \mathsf{path})\ \Rightarrow \ \operatorname{Op}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{AlreadyExists},\ \omega ) \\[0.16em]
\mathsf{Op}\ \in \ \{\mathsf{IOCreateDir},\ \mathsf{IOEnsureDir}\}\ \land \ \operatorname{EntryExists}(\omega ,\ \mathsf{path})\ \land \ \operatorname{EntryKind}(\omega ,\ \mathsf{path})\ \ne \ \texttt{Dir}\ \Rightarrow \ \operatorname{Op}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{AlreadyExists},\ \omega ) \\[0.16em]
\mathsf{Op}\ =\ \mathsf{IOOpenDir}\ \land \ \operatorname{EntryExists}(\omega ,\ \mathsf{path})\ \land \ \operatorname{EntryKind}(\omega ,\ \mathsf{path})\ \ne \ \texttt{Dir}\ \Rightarrow \ \operatorname{Op}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{InvalidPath},\ \omega ) \\[0.16em]
\operatorname{Busy}(\mathsf{io},\ \mathsf{path},\ \mathsf{Op},\ \omega )\ \Rightarrow \ \operatorname{Op}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{Busy},\ \omega ) \\[0.16em]
\operatorname{OtherFailure}(\mathsf{io},\ \mathsf{path},\ \mathsf{Op},\ \omega )\ \Rightarrow \ \operatorname{Op}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{IoError}\mathbin{::} \mathsf{IoFailure},\ \omega )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IOReadFile}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ')\ \land \ \operatorname{IOReadBytes}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{bytes},\ \omega '')\ \land \ \lnot \ \operatorname{Utf8Valid}(\mathsf{bytes})\ \Rightarrow \ r\ =\ \mathsf{IoError}\mathbin{::} \mathsf{IoFailure} \\[0.16em]
\operatorname{FileReadAll}(h,\ \omega )\ \Downarrow \ (r,\ \omega ')\ \land \ \operatorname{FileReadAllBytes}(h,\ \omega )\ \Downarrow \ (\mathsf{bytes},\ \omega '')\ \land \ \lnot \ \operatorname{Utf8Valid}(\mathsf{bytes})\ \Rightarrow \ r\ =\ \mathsf{IoError}\mathbin{::} \mathsf{IoFailure}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IOExists}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{true},\ \omega ')\ \Rightarrow \ \operatorname{EntryExists}(\omega ,\ \mathsf{path})\ \land \ \lnot \ \operatorname{PathInvalid}(\mathsf{io},\ \mathsf{path},\ \omega ) \\[0.16em]
\operatorname{IOExists}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\mathsf{false},\ \omega ')\ \Rightarrow \ \operatorname{PathInvalid}(\mathsf{io},\ \mathsf{path},\ \omega )\ \lor \ \lnot \ \operatorname{EntryExists}(\omega ,\ \mathsf{path})
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
\operatorname{DirSnapshot}(\mathsf{io},\ \mathsf{path},\ \omega )\ = \\[0.16em]
\ [\ \texttt{DirEntry}\{\texttt{path}:\ \operatorname{Join}(\mathsf{path},\ \mathsf{name}),\ \texttt{name}:\ \mathsf{name},\ \texttt{kind}:\ \operatorname{EntryKind}(\omega ,\ \operatorname{Join}(\mathsf{path},\ \mathsf{name}))\}\ \mid \ \mathsf{name}\ \in \ \operatorname{DirNames}(\omega ,\ \mathsf{path})\ \land \ \mathsf{name}\ \ne \ \texttt{"."}\ \land \ \mathsf{name}\ \ne \ \texttt{".."}\ ]\ \mathsf{if}\ \operatorname{Entries}(\omega )[\mathsf{path}]\ =\ \operatorname{DirEntry}(\_) \\[0.16em]
\ []\quad \mathsf{otherwise} \\[0.16em]
\operatorname{DirEntries}(\mathsf{io},\ \mathsf{path},\ \omega )\ =\ \mathsf{sort}\_\{\lambda \ a,\ b.\ \operatorname{EntryOrder}(a.\mathsf{name},\ b.\mathsf{name})\}(\operatorname{DirSnapshot}(\mathsf{io},\ \mathsf{path},\ \omega ))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IOOpenRead}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{File@Read}\{\texttt{handle}:\ h\},\ \omega ')\ \Rightarrow \ \operatorname{HandleStateOf}(\omega ',\ h)\ =\ \texttt{OpenRead}\ \land \ \operatorname{HandlePos}(\omega ',\ h)\ =\ 0\ \land \ \operatorname{HandlePath}(\omega ',\ h)\ =\ \mathsf{path}\ \land \ \operatorname{HandleLen}(\omega ',\ h)\ =\ \operatorname{FileLenAt}(\omega ,\ \mathsf{path}) \\[0.16em]
\operatorname{IOOpenWrite}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{File@Write}\{\texttt{handle}:\ h\},\ \omega ')\ \Rightarrow \ \operatorname{HandleStateOf}(\omega ',\ h)\ =\ \texttt{OpenWrite}\ \land \ \operatorname{HandlePos}(\omega ',\ h)\ =\ 0\ \land \ \operatorname{HandlePath}(\omega ',\ h)\ =\ \mathsf{path}\ \land \ \operatorname{HandleLen}(\omega ',\ h)\ =\ \operatorname{FileLenAt}(\omega ,\ \mathsf{path}) \\[0.16em]
\operatorname{IOOpenAppend}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{File@Append}\{\texttt{handle}:\ h\},\ \omega ')\ \Rightarrow \ \operatorname{HandleStateOf}(\omega ',\ h)\ =\ \texttt{OpenAppend}\ \land \ \operatorname{HandlePos}(\omega ',\ h)\ =\ \operatorname{FileLenAt}(\omega ,\ \mathsf{path})\ \land \ \operatorname{HandlePath}(\omega ',\ h)\ =\ \mathsf{path}\ \land \ \operatorname{HandleLen}(\omega ',\ h)\ =\ \operatorname{FileLenAt}(\omega ,\ \mathsf{path}) \\[0.16em]
\operatorname{IOCreateWrite}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{File@Write}\{\texttt{handle}:\ h\},\ \omega ')\ \Rightarrow \ \operatorname{HandleStateOf}(\omega ',\ h)\ =\ \texttt{OpenWrite}\ \land \ \operatorname{HandlePos}(\omega ',\ h)\ =\ 0\ \land \ \operatorname{HandlePath}(\omega ',\ h)\ =\ \mathsf{path}\ \land \ \operatorname{HandleLen}(\omega ',\ h)\ =\ 0
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IOReadFile}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ')\ \Leftrightarrow \ \exists \ h,\ \omega_{1} ,\ \omega_{2} .\ \operatorname{IOOpenRead}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{File@Read}\{\texttt{handle}:\ h\},\ \omega_{1} )\ \land \ \operatorname{FileReadAll}(h,\ \omega_{1} )\ \Downarrow \ (r,\ \omega_{2} )\ \land \ \operatorname{FileClose}(h,\ \omega_{2} )\ \Downarrow \ (\mathsf{ok},\ \omega ') \\[0.16em]
\operatorname{IOReadBytes}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (r,\ \omega ')\ \Leftrightarrow \ \exists \ h,\ \omega_{1} ,\ \omega_{2} .\ \operatorname{IOOpenRead}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{File@Read}\{\texttt{handle}:\ h\},\ \omega_{1} )\ \land \ \operatorname{FileReadAllBytes}(h,\ \omega_{1} )\ \Downarrow \ (r,\ \omega_{2} )\ \land \ \operatorname{FileClose}(h,\ \omega_{2} )\ \Downarrow \ (\mathsf{ok},\ \omega ')
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
\operatorname{IOOpenDir}(\mathsf{io},\ \mathsf{path},\ \omega )\ \Downarrow \ (\texttt{DirIter@Open}\{\texttt{handle}:\ h\},\ \omega ')\ \Rightarrow \ \operatorname{DirIterOpen}(\omega ',\ h)\ \land \ \operatorname{DirIterIO}(\omega ',\ h)\ =\ \mathsf{io}\ \land \ \operatorname{DirIterPath}(\omega ',\ h)\ =\ \mathsf{path}\ \land \ \operatorname{DirIterEntries}(\omega ',\ h)\ =\ \operatorname{DirEntries}(\mathsf{io},\ \mathsf{path},\ \omega )\ \land \ \operatorname{DirIterPos}(\omega ',\ h)\ =\ 0
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

**(Prim-IO-OpenRead)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOOpenRead}(v_{\mathsf{io}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{open\_read},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-OpenWrite)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOOpenWrite}(v_{\mathsf{io}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{open\_write},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-OpenAppend)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOOpenAppend}(v_{\mathsf{io}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{open\_append},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-CreateWrite)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOCreateWrite}(v_{\mathsf{io}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{create\_write},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-ReadFile)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOReadFile}(v_{\mathsf{io}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{read\_file},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-ReadBytes)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOReadBytes}(v_{\mathsf{io}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{read\_bytes},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-WriteFile)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOWriteFile}(v_{\mathsf{io}},\ p,\ d)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{write\_file},\ v_{\mathsf{io}},\ [p,\ d])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-WriteStdout)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOWriteStdout}(v_{\mathsf{io}},\ d)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{write\_stdout},\ v_{\mathsf{io}},\ [d])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-WriteStderr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOWriteStderr}(v_{\mathsf{io}},\ d)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{write\_stderr},\ v_{\mathsf{io}},\ [d])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-Exists)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOExists}(v_{\mathsf{io}},\ p)\ \Downarrow \ b \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{exists},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(b)
\end{array}
$$

**(Prim-IO-Remove)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IORemove}(v_{\mathsf{io}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{remove},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-OpenDir)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOOpenDir}(v_{\mathsf{io}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{open\_dir},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-CreateDir)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOCreateDir}(v_{\mathsf{io}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{create\_dir},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-EnsureDir)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOEnsureDir}(v_{\mathsf{io}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{ensure\_dir},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-Kind)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IOKind}(v_{\mathsf{io}},\ p)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{kind},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-IO-Restrict)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{IORestrict}(v_{\mathsf{io}},\ p)\ \Downarrow \ v_{\mathsf{io}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{IO},\ \texttt{restrict},\ v_{\mathsf{io}},\ [p])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{io}}')
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
