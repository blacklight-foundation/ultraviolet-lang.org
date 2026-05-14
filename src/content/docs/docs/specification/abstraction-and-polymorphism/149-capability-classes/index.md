---
title: "14.9 Capability Classes"
description: "14.9 Capability Classes from 14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "abstraction-and-polymorphism"
specSection: "149-capability-classes"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstraction-and-polymorphism/">14. Abstraction and Polymorphism</a>
  <span>Abstraction and Polymorphism</span>
</div>

## 14.9 Capability Classes

### 14.9.1 Syntax

Capability classes use the ordinary class syntax from §14.3 and dynamic class type syntax from §14.6. No distinct surface grammar is introduced.

### 14.9.2 Parsing

Capability classes have no feature-specific parser beyond ordinary class parsing and `$Class` type parsing.

### 14.9.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{CapClass}\ =\ \{\texttt{FileSystem},\ \texttt{Network},\ \texttt{HeapAllocator},\ \texttt{ExecutionDomain},\ \texttt{Reactor},\ \texttt{Time},\ \texttt{MonotonicTime},\ \texttt{WallTime}\} \\[0.16em]
\operatorname{CapType}(\mathsf{Cl})\ =\ \operatorname{TypeDynamic}(\mathsf{Cl})
\end{array}
$$

FileSystemInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"open\_read"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypeModalState}([\texttt{"File"}],\ \texttt{@Read}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"open\_write"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypeModalState}([\texttt{"File"}],\ \texttt{@Write}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"open\_append"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypeModalState}([\texttt{"File"}],\ \texttt{@Append}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"create\_write"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypeModalState}([\texttt{"File"}],\ \texttt{@Write}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"read\_file"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"read\_bytes"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"write\_file"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ,\ \langle \bot ,\ \texttt{data},\ \operatorname{TypeBytes}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"write\_stdout"},\ \texttt{const},\ [\langle \bot ,\ \texttt{data},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"write\_stderr"},\ \texttt{const},\ [\langle \bot ,\ \texttt{data},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"exists"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle , \\[0.16em]
\ \langle \texttt{"remove"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"open\_dir"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypeModalState}([\texttt{"DirIter"}],\ \texttt{@Open}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"create\_dir"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"ensure\_dir"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"kind"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypePath}([\texttt{"FileKind"}]),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"restrict"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeDynamic}(\texttt{FileSystem})\rangle  \\[0.16em]
\}
\end{array}
$$

NetworkInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"restrict\_to\_host"},\ \texttt{const},\ [\langle \bot ,\ \texttt{host},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeDynamic}(\texttt{Network})\rangle  \\[0.16em]
\}
\end{array}
$$

HeapAllocatorInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"with\_quota"},\ \texttt{const},\ [\langle \bot ,\ \texttt{size},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle , \\[0.16em]
\ \langle \texttt{"alloc\_raw"},\ \texttt{const},\ [\langle \bot ,\ \texttt{count},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeRawPtr}(\texttt{mut},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle , \\[0.16em]
\ \langle \texttt{"dealloc\_raw"},\ \texttt{const},\ [\langle \bot ,\ \texttt{ptr},\ \operatorname{TypeRawPtr}(\texttt{mut},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ,\ \langle \bot ,\ \texttt{count},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle  \\[0.16em]
\}
\end{array}
$$

TimeInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"monotonic"},\ \texttt{const},\ [],\ \operatorname{TypeDynamic}(\texttt{MonotonicTime})\rangle , \\[0.16em]
\ \langle \texttt{"wall"},\ \texttt{const},\ [],\ \operatorname{TypeDynamic}(\texttt{WallTime})\rangle  \\[0.16em]
\}
\end{array}
$$

MonotonicTimeInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"now"},\ \texttt{const},\ [],\ \operatorname{TypePath}([\texttt{"MonotonicInstant"}])\rangle , \\[0.16em]
\ \langle \texttt{"resolution"},\ \texttt{const},\ [],\ \operatorname{TypePath}([\texttt{"Duration"}])\rangle , \\[0.16em]
\ \langle \texttt{"elapsed"},\ \texttt{const},\ [\langle \bot ,\ \texttt{start},\ \operatorname{TypePath}([\texttt{"MonotonicInstant"}])\rangle ,\ \langle \bot ,\ \texttt{end},\ \operatorname{TypePath}([\texttt{"MonotonicInstant"}])\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePath}([\texttt{"Duration"}]),\ \operatorname{TypePath}([\texttt{"TimeError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"coarsen"},\ \texttt{const},\ [\langle \bot ,\ \texttt{resolution},\ \operatorname{TypePath}([\texttt{"Duration"}])\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypeDynamic}(\texttt{MonotonicTime}),\ \operatorname{TypePath}([\texttt{"TimeError"}])])\rangle  \\[0.16em]
\}
\end{array}
$$

WallTimeInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"now\_utc"},\ \texttt{const},\ [],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePath}([\texttt{"UtcInstant"}]),\ \operatorname{TypePath}([\texttt{"TimeError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"resolution"},\ \texttt{const},\ [],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePath}([\texttt{"Duration"}]),\ \operatorname{TypePath}([\texttt{"TimeError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"coarsen"},\ \texttt{const},\ [\langle \bot ,\ \texttt{resolution},\ \operatorname{TypePath}([\texttt{"Duration"}])\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypeDynamic}(\texttt{WallTime}),\ \operatorname{TypePath}([\texttt{"TimeError"}])])\rangle  \\[0.16em]
\}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{FileKindVariants}\ =\ [ \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{File},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{Dir},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{Other},\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{FileKindDecl}\ =\ \operatorname{EnumDecl}(\bot ,\ \texttt{public},\ \texttt{FileKind},\ \bot ,\ \bot ,\ [],\ \mathsf{FileKindVariants},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{IoErrorVariants}\ =\ [ \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{NotFound},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{PermissionDenied},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{AlreadyExists},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{InvalidPath},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{Busy},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{IoFailure},\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{IoErrorDecl}\ =\ \operatorname{EnumDecl}(\bot ,\ \texttt{public},\ \texttt{IoError},\ \bot ,\ \bot ,\ [],\ \mathsf{IoErrorVariants},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{DirEntryFields}\ =\ [ \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{name},\ \operatorname{TypeString}(\texttt{@Managed}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{path},\ \operatorname{TypeString}(\texttt{@Managed}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{kind},\ \operatorname{TypePath}([\texttt{"FileKind"}]),\ \bot ,\ \bot ,\ \bot \rangle  \\[0.16em]
] \\[0.16em]
\mathsf{DirEntryDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{DirEntry},\ \bot ,\ \bot ,\ [],\ \mathsf{DirEntryFields},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{AllocationErrorVariants}\ =\ [ \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{OutOfMemory},\ \operatorname{TuplePayload}([\operatorname{TypePrim}(\texttt{"usize"})]),\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{QuotaExceeded},\ \operatorname{TuplePayload}([\operatorname{TypePrim}(\texttt{"usize"})]),\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{AllocationErrorDecl}\ =\ \operatorname{EnumDecl}(\bot ,\ \texttt{public},\ \texttt{AllocationError},\ \bot ,\ \bot ,\ [],\ \mathsf{AllocationErrorVariants},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{TimeErrorVariants}\ =\ [ \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{Unsupported},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{ClockUnavailable},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{OutOfRange},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{InvalidResolution},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{ClockMismatch},\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{TimeErrorDecl}\ =\ \operatorname{EnumDecl}(\bot ,\ \texttt{public},\ \texttt{TimeError},\ \bot ,\ \bot ,\ [],\ \mathsf{TimeErrorVariants},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{DurationFields}\ =\ [ \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{nanoseconds},\ \operatorname{TypePrim}(\texttt{"u128"}),\ \bot ,\ \bot ,\ \bot \rangle  \\[0.16em]
] \\[0.16em]
\mathsf{DurationDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{Duration},\ \bot ,\ \bot ,\ [],\ \mathsf{DurationFields},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{MonotonicInstantFields}\ =\ [ \\[0.16em]
\ \langle \bot ,\ \texttt{private},\ \mathsf{false},\ \texttt{domain},\ \operatorname{TypePrim}(\texttt{"usize"}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{private},\ \mathsf{false},\ \texttt{ticks},\ \operatorname{TypePrim}(\texttt{"u128"}),\ \bot ,\ \bot ,\ \bot \rangle  \\[0.16em]
] \\[0.16em]
\mathsf{MonotonicInstantDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{MonotonicInstant},\ \bot ,\ \bot ,\ [],\ \mathsf{MonotonicInstantFields},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{UtcInstantFields}\ =\ [ \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{unix\_nanoseconds},\ \operatorname{TypePrim}(\texttt{"i128"}),\ \bot ,\ \bot ,\ \bot \rangle  \\[0.16em]
] \\[0.16em]
\mathsf{UtcInstantDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{UtcInstant},\ \bot ,\ \bot ,\ [],\ \mathsf{UtcInstantFields},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ContextFields}\ =\ [ \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{fs},\ \operatorname{TypeDynamic}(\texttt{FileSystem}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{net},\ \operatorname{TypeDynamic}(\texttt{Network}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{sys},\ \operatorname{TypePath}([\texttt{"System"}]),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{reactor},\ \operatorname{TypeDynamic}(\texttt{Reactor}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{time},\ \operatorname{TypeDynamic}(\texttt{Time}),\ \bot ,\ \bot ,\ \bot \rangle  \\[0.16em]
] \\[0.16em]
\mathsf{ContextMethods}\ =\ [ \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"cpu"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeDynamic}(\texttt{ExecutionDomain}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"gpu"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeDynamic}(\texttt{ExecutionDomain}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"inline"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeDynamic}(\texttt{ExecutionDomain}),\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{ContextMembers}\ =\ \mathsf{ContextFields}\ \mathbin{++} \ \mathsf{ContextMethods} \\[0.16em]
\mathsf{ContextDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{Context},\ \bot ,\ \bot ,\ [],\ \mathsf{ContextMembers},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

SystemInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"exit"},\ [\langle \bot ,\ \texttt{code},\ \operatorname{TypePrim}(\texttt{"i32"})\rangle ],\ \operatorname{TypePrim}(\texttt{"!"})\rangle , \\[0.16em]
\ \langle \texttt{"get\_env"},\ [\langle \bot ,\ \texttt{key},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeString}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{"executable\_path"},\ [],\ \operatorname{TypeString}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{"argument\_count"},\ [],\ \operatorname{TypePrim}(\texttt{"usize"})\rangle , \\[0.16em]
\ \langle \texttt{"argument"},\ [\langle \bot ,\ \texttt{index},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeString}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{"current\_directory"},\ [],\ \operatorname{TypeString}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{"run"},\ [\langle \bot ,\ \texttt{command},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypePrim}(\texttt{"i32"})\rangle  \\[0.16em]
\} \\[0.16em]
\mathsf{SystemMembers}\ =\ [ \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"exit"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{code},\ \operatorname{TypePrim}(\texttt{"i32"})\rangle ],\ \operatorname{TypePrim}(\texttt{"!"}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"get\_env"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{key},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeString}(\texttt{@View}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"executable\_path"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeString}(\texttt{@View}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"argument\_count"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypePrim}(\texttt{"usize"}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"argument"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{index},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeString}(\texttt{@View}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"current\_directory"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeString}(\texttt{@View}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"run"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{command},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypePrim}(\texttt{"i32"}),\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{SystemDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{System},\ \bot ,\ \bot ,\ [],\ \mathsf{SystemMembers},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{CpuSetDecl}\ =\ \operatorname{TypeAliasDecl}(\bot ,\ \texttt{public},\ \texttt{CpuSet},\ \bot ,\ \bot ,\ \operatorname{TypePrim}(\texttt{"u64"}),\ \bot ,\ \bot ) \\[0.16em]
\mathsf{PriorityVariants}\ =\ [ \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{Low},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{Normal},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{High},\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{PriorityDecl}\ =\ \operatorname{EnumDecl}(\bot ,\ \texttt{public},\ \texttt{Priority},\ \bot ,\ \bot ,\ [],\ \mathsf{PriorityVariants},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ReactorMethodParams}\ =\ [\langle \texttt{T},\ [],\ \bot ,\ \bot \rangle ,\ \langle \texttt{E},\ [],\ \bot ,\ \bot \rangle ] \\[0.16em]
\mathsf{ReactorMethods}\ =\ [ \\[0.16em]
\ \operatorname{ClassMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"run"},\ \mathsf{ReactorMethodParams},\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{future},\ \operatorname{TypeApply}([\texttt{"Future"}],\ [\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"E"}])])\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"E"}])]),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{ClassMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"register"},\ \mathsf{ReactorMethodParams},\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{future},\ \operatorname{TypeApply}([\texttt{"Future"}],\ [\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"E"}])])\rangle ],\ \operatorname{TypeApply}([\texttt{"Tracked"}],\ [\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"E"}])]),\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{ReactorMethodNames}\ =\ \{\ m.\mathsf{name}\ \mid \ m\ \in \ \mathsf{ReactorMethods}\ \} \\[0.16em]
\mathsf{ReactorDecl}\ =\ \operatorname{ClassDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{Reactor},\ \bot ,\ \bot ,\ [],\ \mathsf{ReactorMethods},\ \bot ,\ \bot ) \\[0.16em]
\Sigma .\mathsf{Classes}[\texttt{"Reactor"}]\ =\ \mathsf{ReactorDecl}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CapMethodSig}(\texttt{FileSystem},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{FileSystemInterface} \\[0.16em]
\operatorname{CapMethodSig}(\texttt{Network},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{NetworkInterface} \\[0.16em]
\operatorname{CapMethodSig}(\texttt{HeapAllocator},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{HeapAllocatorInterface} \\[0.16em]
\operatorname{CapMethodSig}(\texttt{Reactor},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{LookupClassMethod}(\texttt{Reactor},\ \mathsf{name})\ =\ m\ \land \ \operatorname{Sig_T}(\mathsf{SelfVar},\ m)\ =\ \langle \_,\ \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{CapMethodSig}(\texttt{Time},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{TimeInterface} \\[0.16em]
\operatorname{CapMethodSig}(\texttt{MonotonicTime},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{MonotonicTimeInterface} \\[0.16em]
\operatorname{CapMethodSig}(\texttt{WallTime},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{WallTimeInterface} \\[0.16em]
\operatorname{SystemMethodSig}(\mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{SystemInterface}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CapRecv}(\texttt{FileSystem},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{FileSystemInterface} \\[0.16em]
\operatorname{CapRecv}(\texttt{Network},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{NetworkInterface} \\[0.16em]
\operatorname{CapRecv}(\texttt{HeapAllocator},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{HeapAllocatorInterface} \\[0.16em]
\operatorname{CapRecv}(\texttt{Reactor},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \operatorname{LookupClassMethod}(\texttt{Reactor},\ \mathsf{name})\ =\ m\ \land \ \operatorname{RecvPerm}(\mathsf{SelfVar},\ m.\mathsf{receiver})\ =\ \mathsf{recv} \\[0.16em]
\operatorname{CapRecv}(\texttt{Time},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{TimeInterface} \\[0.16em]
\operatorname{CapRecv}(\texttt{MonotonicTime},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{MonotonicTimeInterface} \\[0.16em]
\operatorname{CapRecv}(\texttt{WallTime},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{WallTimeInterface}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{LowerCallJudg}\ =\ \{\mathsf{MethodSymbol},\ \mathsf{BuiltinMethodSym},\ \mathsf{LowerMethodCall},\ \mathsf{LowerArgs},\ \mathsf{LowerRecvArg}\} \\[0.16em]
\operatorname{ModalStateOf}(T)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \Leftrightarrow \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S) \\[0.16em]
\mathsf{BuiltinCapClass}\ =\ \{\texttt{FileSystem},\ \texttt{Network},\ \texttt{HeapAllocator},\ \texttt{Reactor},\ \texttt{Time},\ \texttt{MonotonicTime},\ \texttt{WallTime}\}
\end{array}
$$

### 14.9.4 Static Semantics

Capability classes are ordinary classes in the type system. A parameter of type `$Class` accepts any concrete type implementing `Class`.

Capability classes MAY be used as generic bounds exactly like any other class bound.

The built-in capability class names `FileSystem`, `Network`, `HeapAllocator`, `ExecutionDomain`, `Reactor`, `Time`, `MonotonicTime`, and `WallTime` are reserved. Type-system use of those names is via `CapType(Cl) = TypeDynamic(Cl)`.

Calls to `HeapAllocator.alloc_raw` and `HeapAllocator.dealloc_raw` require `unsafe` context.

**(AllocRaw-Unsafe-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{base}\ :\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\quad \lnot \ \operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{MethodCall}(\mathsf{base},\ \texttt{"alloc\_raw"},\ \mathsf{args})))\quad c\ =\ \operatorname{Code}(\mathsf{AllocRaw}-\mathsf{Unsafe}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \texttt{"alloc\_raw"},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(DeallocRaw-Unsafe-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{base}\ :\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\quad \lnot \ \operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{MethodCall}(\mathsf{base},\ \texttt{"dealloc\_raw"},\ \mathsf{args})))\quad c\ =\ \operatorname{Code}(\mathsf{DeallocRaw}-\mathsf{Unsafe}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \texttt{"dealloc\_raw"},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\mathsf{BuiltinTypes}_{\mathsf{FS}}\ =\ \{\texttt{File},\ \texttt{DirIter},\ \texttt{DirEntry},\ \texttt{FileKind},\ \texttt{IoError}\} \\[0.16em]
\mathsf{BuiltinTypes}_{\mathsf{Time}}\ =\ \{\texttt{Duration},\ \texttt{MonotonicInstant},\ \texttt{UtcInstant},\ \texttt{TimeError}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RecordDecl}([\texttt{"DirEntry"}])\ =\ \mathsf{DirEntryDecl} \\[0.16em]
\operatorname{RecordDecl}([\texttt{"Duration"}])\ =\ \mathsf{DurationDecl} \\[0.16em]
\operatorname{RecordDecl}([\texttt{"MonotonicInstant"}])\ =\ \mathsf{MonotonicInstantDecl} \\[0.16em]
\operatorname{RecordDecl}([\texttt{"UtcInstant"}])\ =\ \mathsf{UtcInstantDecl} \\[0.16em]
\operatorname{RecordDecl}([\texttt{"Context"}])\ =\ \mathsf{ContextDecl} \\[0.16em]
\operatorname{RecordDecl}([\texttt{"System"}])\ =\ \mathsf{SystemDecl} \\[0.16em]
\operatorname{EnumDecl}([\texttt{"FileKind"}])\ =\ \mathsf{FileKindDecl} \\[0.16em]
\operatorname{EnumDecl}([\texttt{"IoError"}])\ =\ \mathsf{IoErrorDecl} \\[0.16em]
\operatorname{EnumDecl}([\texttt{"AllocationError"}])\ =\ \mathsf{AllocationErrorDecl} \\[0.16em]
\operatorname{EnumDecl}([\texttt{"TimeError"}])\ =\ \mathsf{TimeErrorDecl} \\[0.16em]
\operatorname{EnumDecl}([\texttt{"Priority"}])\ =\ \mathsf{PriorityDecl}
\end{array}
$$

$$
\begin{array}{l}
\Sigma .\mathsf{Types}[\texttt{"DirEntry"}]\ =\ \mathsf{DirEntryDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"Duration"}]\ =\ \mathsf{DurationDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"MonotonicInstant"}]\ =\ \mathsf{MonotonicInstantDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"UtcInstant"}]\ =\ \mathsf{UtcInstantDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"FileKind"}]\ =\ \mathsf{FileKindDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"IoError"}]\ =\ \mathsf{IoErrorDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"AllocationError"}]\ =\ \mathsf{AllocationErrorDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"TimeError"}]\ =\ \mathsf{TimeErrorDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"Context"}]\ =\ \mathsf{ContextDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"System"}]\ =\ \mathsf{SystemDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"CpuSet"}]\ =\ \mathsf{CpuSetDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"Priority"}]\ =\ \mathsf{PriorityDecl}
\end{array}
$$

$$
\operatorname{BuiltInContext}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}([\texttt{"Context"}])\ \land \ \operatorname{RecordDecl}([\texttt{"Context"}])\ =\ \mathsf{ContextDecl}
$$

$$
\begin{array}{l}
\operatorname{ContextBundleFieldType}(\texttt{fs})\ =\ \operatorname{TypeDynamic}(\texttt{FileSystem}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{net})\ =\ \operatorname{TypeDynamic}(\texttt{Network}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{heap})\ =\ \operatorname{TypeDynamic}(\texttt{HeapAllocator}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{sys})\ =\ \operatorname{TypePath}([\texttt{"System"}]) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{reactor})\ =\ \operatorname{TypeDynamic}(\texttt{Reactor}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{time})\ =\ \operatorname{TypeDynamic}(\texttt{Time}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{cpu})\ =\ \operatorname{TypeDynamic}(\texttt{ExecutionDomain}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{gpu})\ =\ \operatorname{TypeDynamic}(\texttt{ExecutionDomain}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{inline})\ =\ \operatorname{TypeDynamic}(\texttt{ExecutionDomain})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ContextBundleType}(T)\ \Leftrightarrow \ \operatorname{AliasNorm}(T)\ =\ \operatorname{TypePath}([\texttt{"Context"}]) \\[0.16em]
\operatorname{ContextBundleType}(T)\ \Leftrightarrow \ \operatorname{AliasNorm}(T)\ =\ \operatorname{TypePath}(p)\ \land \ p\ \ne \ [\texttt{"Context"}]\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \forall \ f\ \in \ \operatorname{Fields}(R).\ ((\exists \ T_{f}.\ \operatorname{ContextBundleFieldType}(f.\mathsf{name})\ =\ T_{f}\ \land \ \operatorname{StripPerm}(f.\mathsf{type})\ =\ T_{f})\ \lor \ \operatorname{ContextBundleType}(\operatorname{StripPerm}(f.\mathsf{type})))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{fs})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{FieldValue}(v_{\mathsf{ctx}},\ \texttt{fs})\ =\ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{net})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{FieldValue}(v_{\mathsf{ctx}},\ \texttt{net})\ =\ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{heap})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{FieldValue}(v_{\mathsf{ctx}},\ \texttt{heap})\ =\ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{sys})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{FieldValue}(v_{\mathsf{ctx}},\ \texttt{sys})\ =\ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{reactor})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{FieldValue}(v_{\mathsf{ctx}},\ \texttt{reactor})\ =\ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{time})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{FieldValue}(v_{\mathsf{ctx}},\ \texttt{time})\ =\ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{cpu})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{ContextDomainValue}(v_{\mathsf{ctx}},\ \texttt{cpu})\ \Downarrow \ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{gpu})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{ContextDomainValue}(v_{\mathsf{ctx}},\ \texttt{gpu})\ \Downarrow \ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{inline})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{ContextDomainValue}(v_{\mathsf{ctx}},\ \texttt{inline})\ \Downarrow \ v
\end{array}
$$

$$
\operatorname{ContextDomainValue}(v_{\mathsf{ctx}},\ m)\ \Downarrow \ v\ \Leftrightarrow \ m\ \in \ \{\texttt{cpu},\ \texttt{gpu},\ \texttt{inline}\}\ \land \ v\ \mathsf{is}\ \mathsf{the}\ \mathsf{value}\ \mathsf{denoted}\ \mathsf{by}\ \mathsf{evaluating}\ \mathsf{the}\ \mathsf{corresponding}\ \mathsf{built}-\mathsf{in}\ \texttt{Context}\ \mathsf{method}\ \mathsf{on}\ v_{\mathsf{ctx}}
$$

$$
\begin{array}{l}
\operatorname{ContextBundleBuild}(T,\ v_{\mathsf{ctx}})\ \Downarrow \ v_{\mathsf{ctx}}\ \Leftrightarrow \ \operatorname{AliasNorm}(T)\ =\ \operatorname{TypePath}([\texttt{"Context"}]) \\[0.16em]
\operatorname{ContextBundleBuild}(T,\ v_{\mathsf{ctx}})\ \Downarrow \ \operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{fs}_{\mathsf{out}})\ \Leftrightarrow  \\[0.16em]
\ \operatorname{AliasNorm}(T)\ =\ \operatorname{TypePath}(p)\ \land \ p\ \ne \ [\texttt{"Context"}]\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land  \\[0.16em]
\ \mathsf{fs}_{\mathsf{out}}\ =\ [\langle f.\mathsf{name},\ v_{f}\rangle \ \mid \ f\ \in \ \operatorname{Fields}(R)\ \land \ ((\exists \ T_{f}.\ \operatorname{ContextBundleFieldType}(f.\mathsf{name})\ =\ T_{f}\ \land \ \operatorname{StripPerm}(f.\mathsf{type})\ =\ T_{f}\ \land \ \operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ f.\mathsf{name})\ \Downarrow \ v_{f})\ \lor \ (\operatorname{ContextBundleType}(\operatorname{StripPerm}(f.\mathsf{type}))\ \land \ \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(f.\mathsf{type}),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{f}))]
\end{array}
$$

$$
\operatorname{AllocErrorVal}(r)\ \Leftrightarrow \ \exists \ s.\ r\ =\ \operatorname{EnumValue}([\texttt{"AllocationError"},\ \texttt{"OutOfMemory"}],\ \operatorname{TuplePayload}([s]))\ \lor \ r\ =\ \operatorname{EnumValue}([\texttt{"AllocationError"},\ \texttt{"QuotaExceeded"}],\ \operatorname{TuplePayload}([s]))
$$

### 14.9.5 Dynamic Semantics

Capability classes introduce no separate dispatch model. Built-in capability operations have primitive implementations, but capability values are still expressed through the same dynamic-class-object machinery as other dispatchable classes.

### 14.9.6 Lowering

Calls on dynamic receivers of builtin capability classes `FileSystem`, `Network`, `HeapAllocator`, `Reactor`, `Time`, `MonotonicTime`, and `WallTime` lower to builtin method symbols rather than emitted vtable-call sequences. Other capability classes lower through the ordinary dynamic-dispatch path of §14.6.

### 14.9.7 Diagnostics

Diagnostics are defined for capability operations that require `unsafe`, including raw allocation and deallocation through `HeapAllocator`.
