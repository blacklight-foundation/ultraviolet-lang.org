---
title: "24.6 Runtime Interface"
description: "24.6 Runtime Interface from 24. Common Lowering, Program Lifecycle, and Backend of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "common-lowering-program-lifecycle-and-backend"
specSection: "246-runtime-interface"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/">24. Common Lowering, Program Lifecycle, and Backend</a>
  <span>Common Lowering, Program Lifecycle, and Backend</span>
</div>

## 24.6 Runtime Interface

Feature-local runtime behavior remains owned by the feature sections that invoke these built-ins. This section defines only the runtime symbol surface, builtin modal layout hooks, and runtime declaration interface.

### 24.6.1 Built-in Modal Layout and Capability Symbols

$$
\mathsf{RuntimeIfcJudg}\ =\ \{\mathsf{BuiltinModalLayout},\ \mathsf{BuiltinModalSym},\ \mathsf{RegionAddrIsActiveSym},\ \mathsf{RegionAddrTagFromSym},\ \mathsf{BuiltinSym}\}
$$

$$
\operatorname{BuiltinModalLayoutSpec}(\texttt{Region})\ =\ \langle 16,\ 8,\ \mathsf{u8},\ \langle 8,\ 8\rangle \rangle 
$$

**(BuiltinModalLayout)**

$$
\begin{array}{l}
\operatorname{BuiltinModalLayoutSpec}(\mathsf{modal})\ =\ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{disc},\ \mathsf{payload}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinModalLayout}(\mathsf{modal})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ [\langle \texttt{disc},\ \mathsf{disc}\rangle ,\ \langle \texttt{payload},\ \mathsf{payload}\rangle ]\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{BuiltinModalSymMap}\ =\ [ \\[0.16em]
\ \langle \texttt{Region::new\_scoped},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"new\_scoped"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::alloc},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"alloc"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::mark},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"mark"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::reset\_to},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"reset\_to"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::reset\_unchecked},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"reset\_unchecked"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::freeze},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"freeze"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::thaw},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"thaw"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::free\_unchecked},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"free\_unchecked"}])\rangle , \\[0.16em]
\ \langle \texttt{CancelToken::new},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"new"}])\rangle , \\[0.16em]
\ \langle \texttt{CancelToken::Active::cancel},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"Active"},\ \texttt{"cancel"}])\rangle , \\[0.16em]
\ \langle \texttt{CancelToken::Active::is\_cancelled},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"Active"},\ \texttt{"is\_cancelled"}])\rangle , \\[0.16em]
\ \langle \texttt{CancelToken::Active::child},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"Active"},\ \texttt{"child"}])\rangle , \\[0.16em]
\ \langle \texttt{CancelToken::Active::wait\_cancelled},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"Active"},\ \texttt{"wait\_cancelled"}])\rangle  \\[0.16em]
]
\end{array}
$$

**(BuiltinModalSym)**

$$
\begin{array}{l}
\langle \mathsf{proc},\ \mathsf{sym}\rangle \ \in \ \mathsf{BuiltinModalSymMap} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\mathsf{proc})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(RegionAddr-AddrIsActive)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{RegionAddrIsActiveSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"addr\_is\_active"}])
\end{array}
$$

**(RegionAddr-AddrTagFrom)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{RegionAddrTagFromSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"addr\_tag\_from"}])
\end{array}
$$

**(BuiltinSym-FileSystem-OpenRead)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::open\_read})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"open\_read"}])
\end{array}
$$

**(BuiltinSym-FileSystem-OpenWrite)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::open\_write})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"open\_write"}])
\end{array}
$$

**(BuiltinSym-FileSystem-OpenAppend)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::open\_append})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"open\_append"}])
\end{array}
$$

**(BuiltinSym-FileSystem-CreateWrite)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::create\_write})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"create\_write"}])
\end{array}
$$

**(BuiltinSym-FileSystem-ReadFile)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::read\_file})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"read\_file"}])
\end{array}
$$

**(BuiltinSym-FileSystem-ReadBytes)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::read\_bytes})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"read\_bytes"}])
\end{array}
$$

**(BuiltinSym-FileSystem-WriteFile)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::write\_file})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"write\_file"}])
\end{array}
$$

**(BuiltinSym-FileSystem-WriteStdout)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::write\_stdout})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"write\_stdout"}])
\end{array}
$$

**(BuiltinSym-FileSystem-WriteStderr)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::write\_stderr})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"write\_stderr"}])
\end{array}
$$

**(BuiltinSym-FileSystem-Exists)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::exists})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"exists"}])
\end{array}
$$

**(BuiltinSym-FileSystem-Remove)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::remove})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"remove"}])
\end{array}
$$

**(BuiltinSym-FileSystem-OpenDir)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::open\_dir})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"open\_dir"}])
\end{array}
$$

**(BuiltinSym-FileSystem-CreateDir)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::create\_dir})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"create\_dir"}])
\end{array}
$$

**(BuiltinSym-FileSystem-EnsureDir)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::ensure\_dir})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"ensure\_dir"}])
\end{array}
$$

**(BuiltinSym-FileSystem-Kind)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::kind})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"kind"}])
\end{array}
$$

**(BuiltinSym-FileSystem-Restrict)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::restrict})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"restrict"}])
\end{array}
$$

**(BuiltinSym-Network-RestrictHost)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Network::restrict\_to\_host})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"net"},\ \texttt{"restrict\_to\_host"}])
\end{array}
$$

**(BuiltinSym-HeapAllocator-WithQuota)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{HeapAllocator::with\_quota})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"heap"},\ \texttt{"with\_quota"}])
\end{array}
$$

**(BuiltinSym-HeapAllocator-AllocRaw)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{HeapAllocator::alloc\_raw})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"heap"},\ \texttt{"alloc\_raw"}])
\end{array}
$$

**(BuiltinSym-HeapAllocator-DeallocRaw)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{HeapAllocator::dealloc\_raw})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"heap"},\ \texttt{"dealloc\_raw"}])
\end{array}
$$

**(BuiltinSym-Reactor-Run)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Reactor::run})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"reactor"},\ \texttt{"run"}])
\end{array}
$$

**(BuiltinSym-Reactor-Register)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Reactor::register})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"reactor"},\ \texttt{"register"}])
\end{array}
$$

**(BuiltinSym-Time-Monotonic)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Time::monotonic})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"monotonic"}])
\end{array}
$$

**(BuiltinSym-Time-Wall)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Time::wall})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"wall"}])
\end{array}
$$

**(BuiltinSym-MonotonicTime-Now)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{MonotonicTime::now})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"monotonic\_now"}])
\end{array}
$$

**(BuiltinSym-MonotonicTime-Resolution)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{MonotonicTime::resolution})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"monotonic\_resolution"}])
\end{array}
$$

**(BuiltinSym-MonotonicTime-Elapsed)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{MonotonicTime::elapsed})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"monotonic\_elapsed"}])
\end{array}
$$

**(BuiltinSym-MonotonicTime-Coarsen)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{MonotonicTime::coarsen})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"monotonic\_coarsen"}])
\end{array}
$$

**(BuiltinSym-WallTime-NowUtc)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{WallTime::now\_utc})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"wall\_now\_utc"}])
\end{array}
$$

**(BuiltinSym-WallTime-Resolution)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{WallTime::resolution})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"wall\_resolution"}])
\end{array}
$$

**(BuiltinSym-WallTime-Coarsen)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{WallTime::coarsen})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"wall\_coarsen"}])
\end{array}
$$

**(BuiltinSym-System-Exit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::exit})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"exit"}])
\end{array}
$$

**(BuiltinSym-System-GetEnv)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::get\_env})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"get\_env"}])
\end{array}
$$

**(BuiltinSym-System-ExecutablePath)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::executable\_path})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"executable\_path"}])
\end{array}
$$

**(BuiltinSym-System-ArgumentCount)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::argument\_count})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"argument\_count"}])
\end{array}
$$

**(BuiltinSym-System-Argument)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::argument})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"argument"}])
\end{array}
$$

**(BuiltinSym-System-CurrentDirectory)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::current\_directory})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"current\_directory"}])
\end{array}
$$

**(BuiltinSym-System-Run)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::run})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"run"}])
\end{array}
$$

### 24.6.2 Managed String/Bytes Runtime Symbols and Drop Hooks

$$
\mathsf{BuiltinSymJudg}\ =\ \{\operatorname{BuiltinSym}(\mathsf{method})\ \Downarrow \ \mathsf{sym}\}
$$

$$
\begin{array}{l}
\mathsf{StringBuiltins}\ =\ \{\texttt{string::from},\ \texttt{string::as\_view},\ \texttt{string::slice},\ \texttt{string::to\_managed},\ \texttt{string::clone\_with},\ \texttt{string::append},\ \texttt{string::length},\ \texttt{string::is\_empty}\} \\[0.16em]
\mathsf{BytesBuiltins}\ =\ \{\texttt{bytes::with\_capacity},\ \texttt{bytes::from\_slice},\ \texttt{bytes::as\_view},\ \texttt{bytes::as\_slice},\ \texttt{bytes::to\_managed},\ \texttt{bytes::view},\ \texttt{bytes::view\_string},\ \texttt{bytes::append},\ \texttt{bytes::length},\ \texttt{bytes::is\_empty}\} \\[0.16em]
\operatorname{StringMethod}(\mathsf{method})\ \Leftrightarrow \ \exists \ \mathsf{name}.\ \mathsf{method}\ =\ \texttt{string::}\mathsf{name} \\[0.16em]
\operatorname{BytesMethod}(\mathsf{method})\ \Leftrightarrow \ \exists \ \mathsf{name}.\ \mathsf{method}\ =\ \texttt{bytes::}\mathsf{name}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuiltinSym}(\texttt{string::from})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"from"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::as\_view})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"as\_view"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::slice})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"slice"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::to\_managed})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"to\_managed"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::clone\_with})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"clone\_with"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::append})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"append"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::length})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"length"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::is\_empty})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"is\_empty"}])
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuiltinSym}(\texttt{bytes::with\_capacity})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"with\_capacity"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::from\_slice})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"from\_slice"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::as\_view})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"as\_view"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::as\_slice})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"as\_slice"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::to\_managed})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"to\_managed"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::view})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"view"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::view\_string})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"view\_string"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::append})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"append"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::length})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"length"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::is\_empty})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"is\_empty"}])
\end{array}
$$

**(BuiltinSym-String-Err)**

$$
\begin{array}{l}
\operatorname{StringMethod}(\mathsf{method})\quad \mathsf{method}\ \notin \ \mathsf{StringBuiltins} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\mathsf{method})\ \Uparrow 
\end{array}
$$

**(BuiltinSym-Bytes-Err)**

$$
\begin{array}{l}
\operatorname{BytesMethod}(\mathsf{method})\quad \mathsf{method}\ \notin \ \mathsf{BytesBuiltins} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\mathsf{method})\ \Uparrow 
\end{array}
$$

$$
\mathsf{DropHookJudg}\ =\ \{\mathsf{StringDropSym}\ \Downarrow \ \mathsf{sym},\ \mathsf{BytesDropSym}\ \Downarrow \ \mathsf{sym}\}
$$

**(StringDropSym-Decl)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{StringDropSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"drop\_managed"}])
\end{array}
$$

**(BytesDropSym-Decl)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{BytesDropSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"drop\_managed"}])
\end{array}
$$

**(StringDropSym-Err)**
StringDropSym undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{StringDropSym}\ \Uparrow 
\end{array}
$$

**(BytesDropSym-Err)**
BytesDropSym undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{BytesDropSym}\ \Uparrow 
\end{array}
$$

### 24.6.3 Runtime and Built-in Declarations

$$
\mathsf{RuntimeDeclJudg}\ =\ \{\operatorname{RuntimeSig}(\mathsf{sym})\ \Downarrow \ \langle \mathsf{params},\ \mathsf{ret}\rangle ,\ \operatorname{BuiltinSig}(\mathsf{method})\ \Downarrow \ \langle \mathsf{params},\ \mathsf{ret}\rangle ,\ \operatorname{RuntimeDecls}(S)\ \Downarrow \ \mathsf{decls}\}
$$

$$
\begin{array}{l}
\mathsf{FileSystemBuiltinMethods}\ =\ \{\texttt{FileSystem::open\_read},\ \texttt{FileSystem::open\_write},\ \texttt{FileSystem::open\_append},\ \texttt{FileSystem::create\_write},\ \texttt{FileSystem::read\_file},\ \texttt{FileSystem::read\_bytes},\ \texttt{FileSystem::write\_file},\ \texttt{FileSystem::write\_stdout},\ \texttt{FileSystem::write\_stderr},\ \texttt{FileSystem::exists},\ \texttt{FileSystem::remove},\ \texttt{FileSystem::open\_dir},\ \texttt{FileSystem::create\_dir},\ \texttt{FileSystem::ensure\_dir},\ \texttt{FileSystem::kind},\ \texttt{FileSystem::restrict}\} \\[0.16em]
\mathsf{NetworkBuiltinMethods}\ =\ \{\texttt{Network::restrict\_to\_host}\} \\[0.16em]
\mathsf{HeapAllocatorBuiltinMethods}\ =\ \{\texttt{HeapAllocator::with\_quota},\ \texttt{HeapAllocator::alloc\_raw},\ \texttt{HeapAllocator::dealloc\_raw}\} \\[0.16em]
\mathsf{SystemBuiltinMethods}\ =\ \{\texttt{System::name}\ \mid \ \langle \mathsf{name},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{SystemInterface}\} \\[0.16em]
\mathsf{ReactorBuiltinMethods}\ =\ \{\texttt{Reactor::run},\ \texttt{Reactor::register}\} \\[0.16em]
\mathsf{TimeBuiltinMethods}\ =\ \{\texttt{Time::monotonic},\ \texttt{Time::wall},\ \texttt{MonotonicTime::now},\ \texttt{MonotonicTime::resolution},\ \texttt{MonotonicTime::elapsed},\ \texttt{MonotonicTime::coarsen},\ \texttt{WallTime::now\_utc},\ \texttt{WallTime::resolution},\ \texttt{WallTime::coarsen}\} \\[0.16em]
\mathsf{BuiltinMethods}\ =\ \mathsf{StringBuiltins}\ \cup \ \mathsf{BytesBuiltins}\ \cup \ \mathsf{FileSystemBuiltinMethods}\ \cup \ \mathsf{NetworkBuiltinMethods}\ \cup \ \mathsf{HeapAllocatorBuiltinMethods}\ \cup \ \mathsf{SystemBuiltinMethods}\ \cup \ \mathsf{ReactorBuiltinMethods}\ \cup \ \mathsf{TimeBuiltinMethods} \\[0.16em]
\mathsf{RuntimeSyms}\ =\ \{\mathsf{PanicSym},\ \mathsf{StringDropSym},\ \mathsf{BytesDropSym},\ \mathsf{ContextInitSym}\}\ \cup \ \{\operatorname{BuiltinModalSym}(\mathsf{proc})\ \mid \ \mathsf{proc}\ \in \ \operatorname{dom}(\mathsf{BuiltinModalSymMap})\}\ \cup \ \{\mathsf{RegionAddrIsActiveSym},\ \mathsf{RegionAddrTagFromSym}\}\ \cup \ \{\operatorname{BuiltinSym}(\mathsf{method})\ \mid \ \mathsf{method}\ \in \ \mathsf{BuiltinMethods}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuiltinSig}(\texttt{FileSystem}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{FileSystem},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{FileSystem}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{FileSystem},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{Network}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{Network},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{Network}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{Network},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{HeapAllocator}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{HeapAllocator},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{HeapAllocator}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{HeapAllocator},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{System}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypePath}([\texttt{"System"}]))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{SystemMethodSig}(\mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{Reactor}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{Reactor},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{Reactor}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{Reactor},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{Time}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{Time},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{Time}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{Time},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{MonotonicTime}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{MonotonicTime},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{MonotonicTime}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{MonotonicTime},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{WallTime}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{WallTime},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{WallTime}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{WallTime},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{StringBytesBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RuntimeSig}(\mathsf{PanicSym})\ =\ \langle [\langle \bot ,\ \texttt{code},\ \operatorname{TypePrim}(\texttt{"u32"})\rangle ],\ \operatorname{TypePrim}(\texttt{"!"})\rangle  \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{ContextInitSym})\ =\ \langle [],\ \operatorname{TypePath}([\texttt{"Context"}])\rangle  \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{StringDropSym})\ =\ \langle [\langle \texttt{move},\ \texttt{value},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle  \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{BytesDropSym})\ =\ \langle [\langle \texttt{move},\ \texttt{value},\ \operatorname{TypeBytes}(\texttt{@Managed})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle  \\[0.16em]
\operatorname{BuiltinModalProcSig}(\mathsf{proc})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \mathsf{proc}\ \in \ \mathsf{RegionProcs}\ \land \ \operatorname{RegionProcSig}(\mathsf{proc})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::new})\ =\ \langle [],\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active})\rangle  \\[0.16em]
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::Active::cancel})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{shared},\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle  \\[0.16em]
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::Active::is\_cancelled})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle  \\[0.16em]
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::Active::child})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active})\rangle  \\[0.16em]
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::Active::wait\_cancelled})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePath}([\texttt{"Async"}],\ [\operatorname{TypePrim}(\texttt{"()"})])\rangle  \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ,\ \langle \bot ,\ \texttt{size},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \bot ,\ \texttt{align},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeRawPtr}(\texttt{mut},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinModalSym}(\texttt{Region::alloc}) \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePrim}(\texttt{"usize"})\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinModalSym}(\texttt{Region::mark}) \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ,\ \langle \bot ,\ \texttt{mark},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinModalSym}(\texttt{Region::reset\_to}) \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{addr},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \mathsf{RegionAddrIsActiveSym} \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{addr},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ,\ \langle \bot ,\ \texttt{base},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \mathsf{RegionAddrTagFromSym} \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinModalSym}(\mathsf{proc})\ \land \ \mathsf{proc}\ \notin \ \{\texttt{Region::alloc},\ \texttt{Region::mark},\ \texttt{Region::reset\_to}\}\ \land \ \operatorname{BuiltinModalProcSig}(\mathsf{proc})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinSym}(\mathsf{method})\ \land \ \operatorname{BuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle 
\end{array}
$$

$$
\mathsf{LLVMDecl}\ :\ \mathsf{Symbol}\ \times \ \mathsf{Sig}\ \to \ \mathsf{LLVMDecl}
$$

**(RuntimeDecls)**

$$
\begin{array}{l}
\forall \ \mathsf{sym}\ \in \ S,\ \operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \quad \operatorname{LLVMCallSig}(\mathsf{params},\ \mathsf{ret})\ \Downarrow \ \mathsf{sig} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RuntimeDecls}(S)\ \Downarrow \ [\operatorname{LLVMDecl}(\mathsf{sym},\ \mathsf{sig})\ \mid \ \mathsf{sym}\ \in \ S]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{DeclAttrs}\ :\ \mathsf{Symbol}\ \to \ \mathsf{AttrSet} \\[0.16em]
\operatorname{DeclSyms}(\mathsf{LLVMIR})\ =\ \{\ \mathsf{sym}\ \mid \ \operatorname{LLVMDecl}(\mathsf{sym},\ \_)\ \in \ \mathsf{LLVMIR}\ \lor \ \operatorname{LLVMDefine}(\mathsf{sym},\ \_,\ \_)\ \in \ \mathsf{LLVMIR}\ \} \\[0.16em]
\operatorname{DeclAttrsOk}(\mathsf{sym})\ \Leftrightarrow \ (\mathsf{sym}\ =\ \mathsf{PanicSym}\ \Rightarrow \ \{\texttt{noreturn},\ \texttt{nounwind}\}\ \subseteq \ \operatorname{DeclAttrs}(\mathsf{sym}))\ \land \ (\mathsf{sym}\ \ne \ \mathsf{PanicSym}\ \Rightarrow \ \texttt{nounwind}\ \in \ \operatorname{DeclAttrs}(\mathsf{sym})) \\[0.16em]
\operatorname{RuntimeDeclsOk}(\mathsf{decls})\ \Leftrightarrow \ \forall \ \mathsf{sym}\ \in \ \operatorname{DeclSyms}(\mathsf{decls}).\ \operatorname{DeclAttrsOk}(\mathsf{sym}) \\[0.16em]
\operatorname{RuntimeDeclsCover}(\mathsf{LLVMIR},\ \mathsf{IR})\ \Leftrightarrow \ \operatorname{RuntimeRefs}(\mathsf{IR})\ \subseteq \ \operatorname{DeclSyms}(\mathsf{LLVMIR})
\end{array}
$$

### 24.6.4 Network, Heap, Reactor, and Time Host-Primitives

**(Prim-Network-RestrictHost-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{NetRestrictHost}(v_{\mathsf{net}},\ \mathsf{host})\ \Downarrow \ v_{\mathsf{net}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Network},\ \texttt{restrict\_to\_host},\ v_{\mathsf{net}},\ [\mathsf{host}])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{net}}')
\end{array}
$$

$$
\mathsf{HeapJudg}\ =\ \{\operatorname{HeapWithQuota}(v_{\mathsf{heap}},\ \mathsf{quota})\ \Downarrow \ v_{\mathsf{heap}}',\ \operatorname{HeapAllocRaw}(v_{\mathsf{heap}},\ \mathsf{count})\ \Downarrow \ \mathsf{ptr},\ \operatorname{HeapDeallocRaw}(v_{\mathsf{heap}},\ \mathsf{ptr},\ \mathsf{count})\ \Downarrow \ \mathsf{ok}\}
$$

`HeapWithQuota`, `HeapAllocRaw`, and `HeapDeallocRaw` are runtime host-primitive relations with required semantics.

$$
\begin{array}{l}
\operatorname{HeapState}(v_{h})\ =\ \langle \mathsf{parent}_{h},\ \mathsf{quota}_{h},\ \mathsf{used}_{h}\rangle ,\ \mathsf{where}\ \texttt{quota\_h = 0}\ \mathsf{denotes}\ \mathsf{no}\ \mathsf{local}\ \mathsf{quota}\ \mathsf{bound}. \\[0.16em]
\operatorname{Anc}(v_{h})\ =\ [v_{h},\ \mathsf{parent}_{h},\ \operatorname{parent}(\mathsf{parent}_{h}),\ \ldots ]\ \mathsf{truncated}\ \mathsf{at}\ \texttt{bottom}. \\[0.16em]
\operatorname{Headroom}(v_{a})\ =\ +\infty \ \mathsf{if}\ \texttt{quota\_a = 0},\ \mathsf{otherwise}\ \texttt{max(quota\_a - used\_a, 0)}.
\end{array}
$$

A conforming implementation MUST satisfy all of the following:

1. `HeapWithQuota(v_heap, q) ⇓ v_heap'` implies `HeapState(v_heap') = ⟨v_heap, q, 0⟩`.
2. `HeapAllocRaw(v_heap, 0) ⇓ null` and MUST NOT mutate any `HeapState`.
3. For `count > 0`:
   - If `∃ v_a ∈ Anc(v_heap). count > Headroom(v_a)`, then `HeapAllocRaw(v_heap, count) ⇓ null` and MUST NOT mutate any `HeapState`.
   - If quota checks pass but host allocation fails, `HeapAllocRaw(v_heap, count) ⇓ null` and MUST NOT mutate any `HeapState`.
   - Otherwise, `HeapAllocRaw(v_heap, count) ⇓ ptr` with `ptr ≠ null`, and `used_a` MUST increase by `count` for every `v_a ∈ Anc(v_heap)`.
4. `HeapDeallocRaw(v_heap, null, count) ⇓ ok` and MUST NOT mutate any `HeapState`.
5. If `ptr ≠ null` denotes a live allocation previously returned by `HeapAllocRaw` with recorded owner heap `v_owner` and recorded size `n`, then `HeapDeallocRaw(v_heap, ptr, count) ⇓ ok` MUST:
   - free that allocation exactly once, and
   - decrease `used_a` by `n` for every `v_a ∈ Anc(v_owner)`.
6. The `count` argument to `dealloc_raw` is non-authoritative for accounting; accounting MUST use the recorded allocation size.
7. If `ptr` does not denote a live allocation previously returned by `HeapAllocRaw` (including double-free and foreign pointers), behavior is undefined.

**(Prim-Heap-WithQuota)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{HeapWithQuota}(v_{\mathsf{heap}},\ \mathsf{quota})\ \Downarrow \ v_{\mathsf{heap}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{HeapAllocator},\ \texttt{with\_quota},\ v_{\mathsf{heap}},\ [\mathsf{quota}])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{heap}}')
\end{array}
$$

**(Prim-Heap-AllocRaw)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{HeapAllocRaw}(v_{\mathsf{heap}},\ \mathsf{count})\ \Downarrow \ \mathsf{ptr} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{HeapAllocator},\ \texttt{alloc\_raw},\ v_{\mathsf{heap}},\ [\mathsf{count}])\ \Downarrow \ \operatorname{Val}(\mathsf{ptr})
\end{array}
$$

**(Prim-Heap-DeallocRaw)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{HeapDeallocRaw}(v_{\mathsf{heap}},\ \mathsf{ptr},\ \mathsf{count})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{HeapAllocator},\ \texttt{dealloc\_raw},\ v_{\mathsf{heap}},\ [\mathsf{ptr},\ \mathsf{count}])\ \Downarrow \ \operatorname{Val}(\mathsf{UnitVal})
\end{array}
$$

$$
\mathsf{ReactorJudg}\ =\ \{\operatorname{ReactorRun}(v_{\mathsf{reactor}},\ f)\ \Downarrow \ r,\ \operatorname{ReactorRegister}(v_{\mathsf{reactor}},\ f)\ \Downarrow \ h\}
$$

`ReactorRun` and `ReactorRegister` are runtime host-primitive relations that interface the async model (§19) with a concrete event loop.

**(Prim-Reactor-Run)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReactorRun}(v_{\mathsf{reactor}},\ f)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Reactor},\ \texttt{run},\ v_{\mathsf{reactor}},\ [f])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-Reactor-Register)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReactorRegister}(v_{\mathsf{reactor}},\ f)\ \Downarrow \ h \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Reactor},\ \texttt{register},\ v_{\mathsf{reactor}},\ [f])\ \Downarrow \ \operatorname{Val}(h)
\end{array}
$$

Time host-primitives are defined in §6.2.3.

**(Prim-Time-Monotonic-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TimeMonotonic}(v_{\mathsf{time}})\ \Downarrow \ v_{\mathsf{mono}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Time},\ \texttt{monotonic},\ v_{\mathsf{time}},\ [])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{mono}})
\end{array}
$$

**(Prim-Time-Wall-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TimeWall}(v_{\mathsf{time}})\ \Downarrow \ v_{\mathsf{wall}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Time},\ \texttt{wall},\ v_{\mathsf{time}},\ [])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{wall}})
\end{array}
$$

**(Prim-MonotonicTime-Now-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MonotonicTimeNow}(v_{\mathsf{mono}})\ \Downarrow \ t \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{MonotonicTime},\ \texttt{now},\ v_{\mathsf{mono}},\ [])\ \Downarrow \ \operatorname{Val}(t)
\end{array}
$$

**(Prim-MonotonicTime-Resolution-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MonotonicTimeResolution}(v_{\mathsf{mono}})\ \Downarrow \ d \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{MonotonicTime},\ \texttt{resolution},\ v_{\mathsf{mono}},\ [])\ \Downarrow \ \operatorname{Val}(d)
\end{array}
$$

**(Prim-MonotonicTime-Elapsed-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MonotonicTimeElapsed}(v_{\mathsf{mono}},\ \mathsf{start},\ \mathsf{end})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{MonotonicTime},\ \texttt{elapsed},\ v_{\mathsf{mono}},\ [\mathsf{start},\ \mathsf{end}])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-MonotonicTime-Coarsen-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MonotonicTimeCoarsen}(v_{\mathsf{mono}},\ \mathsf{resolution})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{MonotonicTime},\ \texttt{coarsen},\ v_{\mathsf{mono}},\ [\mathsf{resolution}])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-WallTime-NowUtc-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WallTimeNowUtc}(v_{\mathsf{wall}})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{WallTime},\ \texttt{now\_utc},\ v_{\mathsf{wall}},\ [])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-WallTime-Resolution-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WallTimeResolution}(v_{\mathsf{wall}})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{WallTime},\ \texttt{resolution},\ v_{\mathsf{wall}},\ [])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-WallTime-Coarsen-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WallTimeCoarsen}(v_{\mathsf{wall}},\ \mathsf{resolution})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{WallTime},\ \texttt{coarsen},\ v_{\mathsf{wall}},\ [\mathsf{resolution}])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$
