---
title: "22.2 Compile-Time Capabilities"
description: "22.2 Compile-Time Capabilities from 22. Compile-Time Execution and Metaprogramming of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "compile-time-execution-and-metaprogramming"
specSection: "222-compile-time-capabilities"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/compile-time-execution-and-metaprogramming/">22. Compile-Time Execution and Metaprogramming</a>
  <span>Compile-Time Execution and Metaprogramming</span>
</div>

## 22.2 Compile-Time Capabilities

### 22.2.1 Syntax

This section introduces no additional surface syntax beyond `#emit`, `#files`, and the built-in identifiers available in compile-time contexts.

### 22.2.2 Parsing

$$
\mathsf{CtCapName}\ =\ \{\texttt{emitter},\ \texttt{introspect},\ \texttt{files},\ \texttt{diagnostics}\}
$$

**(Parse-CtCapRef)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ \in \ \mathsf{CtCapName} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Identifier}(\operatorname{Lexeme}(\operatorname{Tok}(P))))
\end{array}
$$

Capability method calls then use the ordinary call and method-call parsers.

### 22.2.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{CtCap}\ =\ \{\mathsf{TypeEmitter},\ \mathsf{Introspect},\ \mathsf{ProjectFiles},\ \mathsf{ComptimeDiagnostics}\} \\[0.16em]
\mathsf{CtBuiltinType}\ =\ \{\texttt{Type},\ \texttt{Ast},\ \texttt{Ast::Expr},\ \texttt{Ast::Stmt},\ \texttt{Ast::Item},\ \texttt{Ast::Type},\ \texttt{Ast::Pattern},\ \texttt{TypeCategory},\ \texttt{FieldInfo},\ \texttt{VariantInfo},\ \texttt{StateInfo},\ \texttt{SourceSpan}\} \\[0.16em]
\operatorname{CtCapType}(\texttt{emitter})\ =\ \operatorname{TypePath}([\texttt{"TypeEmitter"}]) \\[0.16em]
\operatorname{CtCapType}(\texttt{introspect})\ =\ \operatorname{TypePath}([\texttt{"Introspect"}]) \\[0.16em]
\operatorname{CtCapType}(\texttt{files})\ =\ \operatorname{TypePath}([\texttt{"ProjectFiles"}]) \\[0.16em]
\operatorname{CtCapType}(\texttt{diagnostics})\ =\ \operatorname{TypePath}([\texttt{"ComptimeDiagnostics"}])
\end{array}
$$

$$
\begin{array}{l}
\operatorname{HasCtCap}(\mathsf{node},\ \texttt{Introspect})\ \Leftrightarrow \ \mathsf{node}\ \mathsf{executes}\ \mathsf{in}\ \mathsf{Phase}\ 2 \\[0.16em]
\operatorname{HasCtCap}(\mathsf{node},\ \texttt{ComptimeDiagnostics})\ \Leftrightarrow \ \mathsf{node}\ \mathsf{executes}\ \mathsf{in}\ \mathsf{Phase}\ 2 \\[0.16em]
\operatorname{HasCtCap}(\mathsf{node},\ \texttt{TypeEmitter})\ \Leftrightarrow \ \mathsf{node}\ \mathsf{executes}\ \mathsf{in}\ \mathsf{Phase}\ 2\ \land \ (\texttt{\#emit}\ \mathsf{applies}\ \mathsf{to}\ \mathsf{node}\ \lor \ \mathsf{node}\ \mathsf{is}\ a\ \mathsf{derive}\ \mathsf{target}\ \mathsf{body}) \\[0.16em]
\operatorname{HasCtCap}(\mathsf{node},\ \texttt{ProjectFiles})\ \Leftrightarrow \ \mathsf{node}\ \mathsf{executes}\ \mathsf{in}\ \mathsf{Phase}\ 2\ \land \ \texttt{\#files}\ \mathsf{applies}\ \mathsf{to}\ \mathsf{node}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{SourceSpanFields}\ =\ [\langle \texttt{file},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ,\ \langle \texttt{start\_line},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \texttt{start\_col},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \texttt{end\_line},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \texttt{end\_col},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ] \\[0.16em]
\mathsf{FieldInfoFields}\ =\ [\langle \texttt{name},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ,\ \langle \texttt{type},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ,\ \langle \texttt{visibility},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ,\ \langle \texttt{index},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \texttt{span},\ \operatorname{TypePath}([\texttt{"SourceSpan"}])\rangle ] \\[0.16em]
\mathsf{VariantInfoFields}\ =\ [\langle \texttt{name},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ,\ \langle \texttt{payload\_kind},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ,\ \langle \texttt{payload\_types},\ \operatorname{TypeSlice}(\operatorname{TypePath}([\texttt{"Type"}]))\rangle ,\ \langle \texttt{field\_names},\ \operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed}))\rangle ,\ \langle \texttt{span},\ \operatorname{TypePath}([\texttt{"SourceSpan"}])\rangle ] \\[0.16em]
\mathsf{StateInfoFields}\ =\ [\langle \texttt{name},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ,\ \langle \texttt{field\_names},\ \operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed}))\rangle ,\ \langle \texttt{method\_names},\ \operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed}))\rangle ,\ \langle \texttt{transition\_names},\ \operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed}))\rangle ,\ \langle \texttt{span},\ \operatorname{TypePath}([\texttt{"SourceSpan"}])\rangle ]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ModulePathText}(\mathsf{path})\ =\ \operatorname{StringOfPath}(\mathsf{path}) \\[0.16em]
\operatorname{CtOutcomeValue}(T,\ v)\ =\ \operatorname{CtModalState}(\operatorname{TypeApply}([\texttt{"Outcome"}],\ [T,\ \operatorname{TypePath}([\texttt{"IoError"}])]),\ \texttt{@Value},\ [\langle \texttt{value},\ v\rangle ]) \\[0.16em]
\operatorname{CtOutcomeError}(T,\ e)\ =\ \operatorname{CtModalState}(\operatorname{TypeApply}([\texttt{"Outcome"}],\ [T,\ \operatorname{TypePath}([\texttt{"IoError"}])]),\ \texttt{@Error},\ [\langle \texttt{error},\ \operatorname{CtEnum}([\texttt{IoError}],\ \operatorname{IoErrorVariant}(e),\ \bot )\rangle ]) \\[0.16em]
\operatorname{CtFileResult}(r,\ T)\ =\ \operatorname{CtOutcomeValue}(T,\ \operatorname{CtString}(r))\quad \mathsf{if}\ r\ \in \ \mathsf{String} \\[0.16em]
\operatorname{CtFileResult}(r,\ T)\ =\ \operatorname{CtOutcomeValue}(T,\ \operatorname{CtBytes}(r))\quad \mathsf{if}\ r\ \in \ \mathsf{Bytes} \\[0.16em]
\operatorname{CtFileResult}(r,\ T)\ =\ \operatorname{CtOutcomeValue}(T,\ \operatorname{CtPrim}(r))\quad \mathsf{if}\ r\ \in \ \mathsf{Bool} \\[0.16em]
\operatorname{CtFileResult}(r,\ T)\ =\ \operatorname{CtOutcomeValue}(T,\ \operatorname{CtSlice}([\operatorname{CtString}(x)\ \mid \ x\ \in \ r]))\quad \mathsf{if}\ r\ \in \ \operatorname{List}(\mathsf{String}) \\[0.16em]
\operatorname{CtFileResult}(r,\ T)\ =\ \operatorname{CtOutcomeError}(T,\ r)\quad \mathsf{if}\ r\ \in \ \mathsf{IoError} \\[0.16em]
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{NotFound})\ =\ \texttt{NotFound} \\[0.16em]
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{PermissionDenied})\ =\ \texttt{PermissionDenied} \\[0.16em]
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{AlreadyExists})\ =\ \texttt{AlreadyExists} \\[0.16em]
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{InvalidPath})\ =\ \texttt{InvalidPath} \\[0.16em]
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{Busy})\ =\ \texttt{Busy} \\[0.16em]
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{IoFailure})\ =\ \texttt{IoFailure} \\[0.16em]
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{DirectoryNotEmpty})\ =\ \texttt{DirectoryNotEmpty} \\[0.16em]
\operatorname{SpanValue}(\mathsf{sp})\ =\ \operatorname{CtRecord}([\texttt{SourceSpan}],\ [\langle \texttt{file},\ \operatorname{CtString}(\mathsf{sp}.\mathsf{file})\rangle ,\ \langle \texttt{start\_line},\ \operatorname{CtPrim}(\mathsf{sp}.\mathsf{start}_{\mathsf{line}})\rangle ,\ \langle \texttt{start\_col},\ \operatorname{CtPrim}(\mathsf{sp}.\mathsf{start}_{\mathsf{col}})\rangle ,\ \langle \texttt{end\_line},\ \operatorname{CtPrim}(\mathsf{sp}.\mathsf{end}_{\mathsf{line}})\rangle ,\ \langle \texttt{end\_col},\ \operatorname{CtPrim}(\mathsf{sp}.\mathsf{end}_{\mathsf{col}})\rangle ]) \\[0.16em]
\operatorname{FieldInfoValue}(\mathsf{name},\ T,\ \mathsf{vis},\ \mathsf{index},\ \mathsf{sp})\ =\ \operatorname{CtRecord}([\texttt{FieldInfo}],\ [\langle \texttt{name},\ \operatorname{CtString}(\mathsf{name})\rangle ,\ \langle \texttt{type},\ \operatorname{CtType}(T)\rangle ,\ \langle \texttt{visibility},\ \operatorname{CtString}(\mathsf{vis})\rangle ,\ \langle \texttt{index},\ \operatorname{CtPrim}(\mathsf{index})\rangle ,\ \langle \texttt{span},\ \operatorname{SpanValue}(\mathsf{sp})\rangle ]) \\[0.16em]
\operatorname{VariantInfoValue}(\mathsf{name},\ \mathsf{payload}_{\mathsf{kind}},\ \mathsf{payload}_{\mathsf{types}},\ \mathsf{field}_{\mathsf{names}},\ \mathsf{sp})\ =\ \operatorname{CtRecord}([\texttt{VariantInfo}],\ [\langle \texttt{name},\ \operatorname{CtString}(\mathsf{name})\rangle ,\ \langle \texttt{payload\_kind},\ \operatorname{CtString}(\mathsf{payload}_{\mathsf{kind}})\rangle ,\ \langle \texttt{payload\_types},\ \operatorname{CtSlice}([\operatorname{CtType}(T)\ \mid \ T\ \in \ \mathsf{payload}_{\mathsf{types}}])\rangle ,\ \langle \texttt{field\_names},\ \operatorname{CtSlice}([\operatorname{CtString}(f)\ \mid \ f\ \in \ \mathsf{field}_{\mathsf{names}}])\rangle ,\ \langle \texttt{span},\ \operatorname{SpanValue}(\mathsf{sp})\rangle ]) \\[0.16em]
\operatorname{StateInfoValue}(\mathsf{name},\ \mathsf{field}_{\mathsf{names}},\ \mathsf{method}_{\mathsf{names}},\ \mathsf{transition}_{\mathsf{names}},\ \mathsf{sp})\ =\ \operatorname{CtRecord}([\texttt{StateInfo}],\ [\langle \texttt{name},\ \operatorname{CtString}(\mathsf{name})\rangle ,\ \langle \texttt{field\_names},\ \operatorname{CtSlice}([\operatorname{CtString}(f)\ \mid \ f\ \in \ \mathsf{field}_{\mathsf{names}}])\rangle ,\ \langle \texttt{method\_names},\ \operatorname{CtSlice}([\operatorname{CtString}(m)\ \mid \ m\ \in \ \mathsf{method}_{\mathsf{names}}])\rangle ,\ \langle \texttt{transition\_names},\ \operatorname{CtSlice}([\operatorname{CtString}(t)\ \mid \ t\ \in \ \mathsf{transition}_{\mathsf{names}}])\rangle ,\ \langle \texttt{span},\ \operatorname{SpanValue}(\mathsf{sp})\rangle ])
\end{array}
$$

TypeEmitterInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"emit"},\ [\langle \bot ,\ \texttt{ast},\ \operatorname{TypePath}([\texttt{"Ast"}])\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle \\[0.16em]
\}
\end{array}
$$

IntrospectInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"category"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypePath}([\texttt{"TypeCategory"}])\rangle , \\[0.16em]
\ \langle \texttt{"fields"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypeSlice}(\operatorname{TypePath}([\texttt{"FieldInfo"}]))\rangle , \\[0.16em]
\ \langle \texttt{"variants"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypeSlice}(\operatorname{TypePath}([\texttt{"VariantInfo"}]))\rangle , \\[0.16em]
\ \langle \texttt{"states"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypeSlice}(\operatorname{TypePath}([\texttt{"StateInfo"}]))\rangle , \\[0.16em]
\ \langle \texttt{"implements\_form"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ,\ \langle \bot ,\ \texttt{form},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle , \\[0.16em]
\ \langle \texttt{"type\_name"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypeString}(\texttt{@Managed})\rangle , \\[0.16em]
\ \langle \texttt{"module\_path"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypeString}(\texttt{@Managed})\rangle \\[0.16em]
\}
\end{array}
$$

ProjectFilesInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"read"},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"read\_bytes"},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"exists"},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"bool"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"list\_dir"},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"project\_root"},\ [],\ \operatorname{TypeString}(\texttt{@Managed})\rangle \\[0.16em]
\}
\end{array}
$$

ComptimeDiagnosticsInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"error"},\ [\langle \bot ,\ \texttt{message},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypePrim}(\texttt{"!"})\rangle , \\[0.16em]
\ \langle \texttt{"warning"},\ [\langle \bot ,\ \texttt{message},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle , \\[0.16em]
\ \langle \texttt{"note"},\ [\langle \bot ,\ \texttt{message},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle , \\[0.16em]
\ \langle \texttt{"current\_span"},\ [],\ \operatorname{TypePath}([\texttt{"SourceSpan"}])\rangle , \\[0.16em]
\ \langle \texttt{"current\_module"},\ [],\ \operatorname{TypeString}(\texttt{@Managed})\rangle \\[0.16em]
\}
\end{array}
$$

### 22.2.4 Static Semantics

`Introspect` and `ComptimeDiagnostics` are available in every compile-time context.

`TypeEmitter` is available only:
- inside a `comptime` form annotated with `#emit`
- inside the body of a derive target declaration

`ProjectFiles` is available only inside a `comptime` form annotated with `#files`.

$$
\operatorname{CtCapBindings}(\mathsf{node})\ =\ [\langle \texttt{introspect},\ \operatorname{TypePath}([\texttt{"Introspect"}])\rangle ,\ \langle \texttt{diagnostics},\ \operatorname{TypePath}([\texttt{"ComptimeDiagnostics"}])\rangle ]\ \mathbin{++} \ ([\langle \texttt{emitter},\ \operatorname{TypePath}([\texttt{"TypeEmitter"}])\rangle ]\ \mathsf{if}\ \operatorname{HasCtCap}(\mathsf{node},\ \texttt{TypeEmitter}),\ \mathsf{else}\ [])\ \mathbin{++} \ ([\langle \texttt{files},\ \operatorname{TypePath}([\texttt{"ProjectFiles"}])\rangle ]\ \mathsf{if}\ \operatorname{HasCtCap}(\mathsf{node},\ \texttt{ProjectFiles}),\ \mathsf{else}\ [])
$$

`files.project_root()`, `files.read(path)`, `files.read_bytes(path)`, `files.exists(path)`, and `files.list_dir(path)` MUST use project-root-relative paths. The argument path:
- MUST NOT be absolute
- MUST NOT contain `..` components that escape the project root after normalization
- MUST be resolved against a deterministic Phase 2 snapshot of project files
- If restriction fails, `files.read`, `files.read_bytes`, `files.exists`, and `files.list_dir` MUST return `IoError::InvalidPath`

$$
\texttt{emitter.emit(ast)}\ \mathsf{requires}\ \texttt{ast}\ \mathsf{to}\ \mathsf{have}\ \mathsf{compile}-\mathsf{time}\ \mathsf{type}\ \texttt{Ast::Item}\ \mathsf{or}\ \texttt{Ast}.
$$

### 22.2.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{CtEmitItem}(\Xi ,\ \Phi ,\ a)\ =\ \Phi '\ \Leftrightarrow \ \operatorname{AstKindOf}(a)\ =\ \texttt{Item}\ \land \ \operatorname{AstHygieneOf}(a)\ =\ \langle \mathsf{quote}_{\mathsf{site}},\ \_,\ \_\rangle \ \land \ \operatorname{HygienizeAst}(a,\ \mathsf{quote}_{\mathsf{site}},\ \operatorname{CtSiteOf}(\Xi ),\ \operatorname{CtFreshSeed}(\Phi ))\ \Downarrow \ (a',\ n')\ \land \ \Phi '\ =\ \langle \operatorname{CtFiles}(\Phi ),\ \operatorname{CtProjectRoot}(\Phi ),\ \operatorname{CtDiags}(\Phi ),\ \operatorname{CtPendingEmits}(\Phi )\ \mathbin{++} \ [\operatorname{AstPayloadOf}(a')],\ n'\rangle \\[0.16em]
\operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ q\ \Leftrightarrow \ \operatorname{RestrictPath}(\operatorname{CtProjectRoot}(\Phi ),\ \mathsf{path})\ =\ q \\[0.16em]
\operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ \bot \ \Leftrightarrow \ \operatorname{RestrictPath}(\operatorname{CtProjectRoot}(\Phi ),\ \mathsf{path})\ =\ \bot \\[0.16em]
\operatorname{CtDiagAppend}(\Xi ,\ \Phi ,\ d)\ =\ \Phi '\ \Leftrightarrow \ \Phi '\ =\ \langle \operatorname{CtFiles}(\Phi ),\ \operatorname{CtProjectRoot}(\Phi ),\ \operatorname{CtDiags}(\Phi )\ \mathbin{++} \ [d],\ \operatorname{CtPendingEmits}(\Phi ),\ \operatorname{CtFreshSeed}(\Phi )\rangle \\[0.16em]
\operatorname{CtUserErrorDiag}(\Xi ,\ \mathsf{msg})\ =\ d\ \Leftrightarrow \ \operatorname{CtSiteOf}(\Xi )\ =\ \langle \_,\ \_,\ \mathsf{sp}\rangle \ \land \ d\ =\ \langle \texttt{E-CTE-0070},\ \mathsf{Error},\ \mathsf{msg},\ \mathsf{sp}\rangle \\[0.16em]
\operatorname{CtUserWarningDiag}(\Xi ,\ \mathsf{msg})\ =\ d\ \Leftrightarrow \ \operatorname{CtSiteOf}(\Xi )\ =\ \langle \_,\ \_,\ \mathsf{sp}\rangle \ \land \ d\ =\ \langle \texttt{W-CTE-0071},\ \mathsf{Warning},\ \mathsf{msg},\ \mathsf{sp}\rangle \\[0.16em]
\operatorname{CtUserNoteDiag}(\Xi ,\ \mathsf{msg})\ =\ d\ \Leftrightarrow \ \operatorname{CtSiteOf}(\Xi )\ =\ \langle \_,\ \_,\ \mathsf{sp}\rangle \ \land \ d\ =\ \langle \bot ,\ \mathsf{Note},\ \mathsf{msg},\ \mathsf{sp}\rangle \\[0.16em]
\operatorname{CtListDirResult}(\mathsf{io},\ q)\ =\ \operatorname{CtSlice}([\operatorname{CtString}(\mathsf{entry}.\mathsf{name})\ \mid \ \mathsf{entry}\ \in \ \mathsf{entries}])\ \Leftrightarrow \ \exists \ \omega .\ \operatorname{DirEntries}(\mathsf{io},\ q,\ \omega )\ =\ \mathsf{entries} \\[0.16em]
\operatorname{CtListDirResult}(\mathsf{io},\ q)\ =\ \operatorname{CtEnum}([\texttt{IoError}],\ \operatorname{IoErrorVariant}(r),\ \bot )\ \Leftrightarrow \ \operatorname{IOOpenDir}(\mathsf{io},\ q)\ \Downarrow \ r\ \land \ r\ \in \ \mathsf{IoError} \\[0.16em]
\operatorname{CtExistsResult}(\mathsf{io},\ q)\ =\ \operatorname{CtPrim}(b)\ \Leftrightarrow \ \operatorname{IOExists}(\mathsf{io},\ q)\ \Downarrow \ b\ \land \ b\ \in \ \mathsf{Bool} \\[0.16em]
\operatorname{CtExistsResult}(\mathsf{io},\ q)\ =\ \operatorname{CtEnum}([\texttt{IoError}],\ \operatorname{IoErrorVariant}(r),\ \bot )\ \Leftrightarrow \ \operatorname{IOExists}(\mathsf{io},\ q)\ \Downarrow \ r\ \land \ r\ \in \ \mathsf{IoError}
\end{array}
$$

**(CtBuiltin-Emit)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{emitter}\quad \mathsf{name}\ =\ \texttt{emit}\quad \mathsf{args}\ =\ [\operatorname{CtAst}(a)]\quad \operatorname{CtEmitItem}(\Xi ,\ \Phi ,\ a)\ =\ \Phi ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtPrim}(\mathsf{UnitVal}),\ \Phi ')
\end{array}
$$

**(CtBuiltin-ProjectRoot)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{project\_root} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ [])\ \Downarrow \ (\operatorname{CtString}(\operatorname{CtProjectRoot}(\Phi )),\ \Phi )
\end{array}
$$

**(CtBuiltin-Read)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{read}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ q\quad \operatorname{IOReadFile}(\operatorname{CtFiles}(\Phi ),\ q)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtFileResult}(r,\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed}))),\ \Phi )
\end{array}
$$

**(CtBuiltin-Read-InvalidPath)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{read}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ \bot \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtOutcomeError}(\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \mathsf{IoError}\mathbin{::} \mathsf{InvalidPath}),\ \Phi )
\end{array}
$$

**(CtBuiltin-ReadBytes)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{read\_bytes}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ q\quad \operatorname{IOReadBytes}(\operatorname{CtFiles}(\Phi ),\ q)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtFileResult}(r,\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed}))),\ \Phi )
\end{array}
$$

**(CtBuiltin-ReadBytes-InvalidPath)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{read\_bytes}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ \bot \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtOutcomeError}(\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \mathsf{IoError}\mathbin{::} \mathsf{InvalidPath}),\ \Phi )
\end{array}
$$

**(CtBuiltin-Exists)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{exists}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ q\quad \operatorname{CtExistsResult}(\operatorname{CtFiles}(\Phi ),\ q)\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtFileResult}(v,\ \operatorname{TypePrim}(\texttt{"bool"})),\ \Phi )
\end{array}
$$

**(CtBuiltin-Exists-InvalidPath)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{exists}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ \bot \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtOutcomeError}(\operatorname{TypePrim}(\texttt{"bool"}),\ \mathsf{IoError}\mathbin{::} \mathsf{InvalidPath}),\ \Phi )
\end{array}
$$

**(CtBuiltin-ListDir)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{list\_dir}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ q\quad \operatorname{CtListDirResult}(\operatorname{CtFiles}(\Phi ),\ q)\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtFileResult}(v,\ \operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed}))),\ \Phi )
\end{array}
$$

**(CtBuiltin-ListDir-InvalidPath)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{list\_dir}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ \bot \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtOutcomeError}(\operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed})),\ \mathsf{IoError}\mathbin{::} \mathsf{InvalidPath}),\ \Phi )
\end{array}
$$

**(CtBuiltin-Diagnostics-Error)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{diagnostics}\quad \mathsf{name}\ =\ \texttt{error}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{msg})]\quad \operatorname{CtUserErrorDiag}(\Xi ,\ \mathsf{msg})\ =\ d\quad \operatorname{CtDiagAppend}(\Xi ,\ \Phi ,\ d)\ =\ \Phi ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Uparrow \ \Phi '
\end{array}
$$

**(CtBuiltin-Diagnostics-Warning)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{diagnostics}\quad \mathsf{name}\ =\ \texttt{warning}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{msg})]\quad \operatorname{CtUserWarningDiag}(\Xi ,\ \mathsf{msg})\ =\ d\quad \operatorname{CtDiagAppend}(\Xi ,\ \Phi ,\ d)\ =\ \Phi ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtPrim}(\mathsf{UnitVal}),\ \Phi ')
\end{array}
$$

**(CtBuiltin-Diagnostics-Note)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{diagnostics}\quad \mathsf{name}\ =\ \texttt{note}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{msg})]\quad \operatorname{CtUserNoteDiag}(\Xi ,\ \mathsf{msg})\ =\ d\quad \operatorname{CtDiagAppend}(\Xi ,\ \Phi ,\ d)\ =\ \Phi ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtPrim}(\mathsf{UnitVal}),\ \Phi ')
\end{array}
$$

**(CtBuiltin-Diagnostics-CurrentSpan)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{diagnostics}\quad \mathsf{name}\ =\ \texttt{current\_span}\quad \operatorname{CtSiteOf}(\Xi )\ =\ \langle \_,\ \_,\ \mathsf{sp}\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ [])\ \Downarrow \ (\operatorname{SpanValue}(\mathsf{sp}),\ \Phi )
\end{array}
$$

**(CtBuiltin-Diagnostics-CurrentModule)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{diagnostics}\quad \mathsf{name}\ =\ \texttt{current\_module}\quad \operatorname{CtSiteOf}(\Xi )\ =\ \langle \mathsf{mp},\ \_,\ \_\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ [])\ \Downarrow \ (\operatorname{CtString}(\operatorname{ModulePathText}(\mathsf{mp})),\ \Phi )
\end{array}
$$

Project-file reads MUST observe the `CtFiles(Φ)` snapshot captured at the start of Phase 2. Host writes during compilation MUST NOT change the values returned by `IOReadFile`, `IOReadBytes`, `IOExists`, or `DirEntries` through that snapshot for the same restricted path.

### 22.2.6 Lowering

Compile-time capabilities introduce no runtime object layout and no runtime symbol requirement beyond the emitted declarations they produce during Phase 2.

### 22.2.7 Diagnostics

Diagnostics for compile-time capabilities are defined by §22.6.
