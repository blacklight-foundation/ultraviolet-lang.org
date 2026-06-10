---
title: "7.1 Scope Context and Identifiers"
description: "7.1 Scope Context and Identifiers from 7. Name Resolution and Visibility of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "name-resolution-and-visibility"
specSection: "71-scope-context-and-identifiers"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/name-resolution-and-visibility/">7. Name Resolution and Visibility</a>
  <span>Name Resolution and Visibility</span>
</div>

## 7.1 Scope Context and Identifiers

$$
\begin{array}{l}
\mathsf{IdKeyRef}\ =\ \{\texttt{"4.2.8"}\} \\[0.16em]
\operatorname{ScopeKey}(S)\ \Leftrightarrow \ \operatorname{dom}(S)\ \subseteq \ \{\operatorname{IdKey}(x)\ \mid \ x\ \in \ \mathsf{Identifier}\}
\end{array}
$$

$$
\begin{array}{l}
\Sigma \ =\ \langle \Sigma .\mathsf{Mods},\ \Sigma .\mathsf{Types},\ \Sigma .\mathsf{Classes}\rangle \\[0.16em]
\Sigma .\mathsf{Mods}\ \in \ [\mathsf{ASTModule}] \\[0.16em]
\Sigma .\mathsf{Types}\ :\ \mathsf{Path}\ \rightharpoonup \ \mathsf{TypeDecl} \\[0.16em]
\Sigma .\mathsf{Classes}\ :\ \mathsf{Path}\ \rightharpoonup \ \mathsf{ClassDecl}
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ =\ \langle P,\ \Sigma ,\ m,\ S\rangle \\[0.16em]
\operatorname{Project}(\Gamma )\ =\ P \\[0.16em]
\operatorname{ResCtx}(\Gamma )\ =\ \langle \Sigma ,\ m\rangle \\[0.16em]
\operatorname{CurrentModule}(\Gamma )\ =\ m \\[0.16em]
\operatorname{Scopes}(\Gamma )\ =\ S
\end{array}
$$

$$
\begin{array}{l}
\mathsf{EntityKind}\ =\ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class},\ \mathsf{ModuleAlias}\} \\[0.16em]
\mathsf{EntitySource}\ =\ \{\mathsf{Decl},\ \mathsf{Using},\ \mathsf{RegionAlias}\} \\[0.16em]
\mathsf{Entity}\ =\ \langle \mathsf{kind},\ \mathsf{origin}_{\mathsf{opt}},\ \mathsf{target}_{\mathsf{opt}},\ \mathsf{source}\rangle \\[0.16em]
\mathsf{origin}_{\mathsf{opt}}\ \in \ \mathsf{ModulePath}\ \cup \ \{\bot \} \\[0.16em]
\mathsf{target}_{\mathsf{opt}}\ \in \ \mathsf{Identifier}\ \cup \ \{\bot \}
\end{array}
$$

$$
S\ :\ \mathsf{IdKey}\ \rightharpoonup \ \mathsf{Entity}
$$

$$
\begin{array}{l}
\operatorname{Scopes}(\Gamma )\ =\ [S_{1},\ \ldots ,\ S_{k},\ S_{\mathsf{proc}},\ S_{\mathsf{module}},\ S_{\mathsf{universe}}]\quad (k\ \ge \ 0) \\[0.16em]
\operatorname{LocalScopes}(\Gamma )\ =\ [S_{1},\ \ldots ,\ S_{k}] \\[0.16em]
\operatorname{ProcScope}(\Gamma )\ =\ S_{\mathsf{proc}} \\[0.16em]
\operatorname{ModuleScope}(\Gamma )\ =\ S_{\mathsf{module}} \\[0.16em]
\operatorname{UniverseScope}(\Gamma )\ =\ S_{\mathsf{universe}}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{UniverseBindings}\ =\ \{\ \operatorname{IdKey}(x)\ \mapsto \ \langle \mathsf{Type},\ \bot ,\ \bot ,\ \mathsf{Decl}\rangle \ \mid \ x\ \in \ \mathsf{UniverseProtected}\ \}\ \cup \ \{\ \operatorname{IdKey}(\texttt{ultraviolet})\ \mapsto \ \langle \mathsf{ModuleAlias},\ \texttt{ultraviolet},\ \bot ,\ \mathsf{Decl}\rangle \ \} \\[0.16em]
S_{\mathsf{universe}}\ =\ \mathsf{UniverseBindings}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BytePrefix}(p,\ s)\ \Leftrightarrow \ \exists \ r.\ s\ =\ p\ \mathbin{++} \ r \\[0.16em]
\operatorname{Prefix}(s,\ p)\ \Leftrightarrow \ \operatorname{BytePrefix}(p,\ s)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReservedGen}(x)\ \Leftrightarrow \ \operatorname{Prefix}(\operatorname{IdKey}(x),\ \operatorname{IdKey}(\texttt{gen\_})) \\[0.16em]
\operatorname{ReservedUltraviolet}(x)\ \Leftrightarrow \ \operatorname{IdEq}(x,\ \texttt{ultraviolet}) \\[0.16em]
\operatorname{ReservedId}(x)\ \Leftrightarrow \ \operatorname{ReservedGen}(x)\ \lor \ \operatorname{ReservedUltraviolet}(x) \\[0.16em]
\operatorname{ReservedModulePath}(\mathsf{path})\ \Leftrightarrow \ (\mid \mathsf{path}\mid \ \ge \ 1\ \land \ \operatorname{IdEq}(\mathsf{path}[0],\ \texttt{ultraviolet}))\ \lor \ (\exists \ i.\ \operatorname{ReservedGen}(\mathsf{path}[i]))
\end{array}
$$


$$
\begin{array}{l}
\mathsf{PrimTypeNames}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64},\ \texttt{bool},\ \texttt{char},\ \texttt{usize},\ \texttt{isize}\} \\[0.16em]
\mathsf{SpecialTypeNames}\ =\ \{\texttt{Self},\ \texttt{Drop},\ \texttt{Bitcopy},\ \texttt{Clone},\ \texttt{Eq},\ \texttt{Hash},\ \texttt{Hasher},\ \texttt{Iterator},\ \texttt{Discrete},\ \texttt{FfiSafe},\ \texttt{string},\ \texttt{bytes},\ \texttt{Modal},\ \texttt{Region},\ \texttt{RegionOptions},\ \texttt{CancelToken},\ \texttt{Context},\ \texttt{TestAuthority},\ \texttt{System},\ \texttt{IO},\ \texttt{HeapAllocator},\ \texttt{Network},\ \texttt{ExecutionDomain},\ \texttt{CpuSet},\ \texttt{Priority},\ \texttt{Reactor},\ \texttt{Time},\ \texttt{MonotonicTime},\ \texttt{WallTime},\ \texttt{Duration},\ \texttt{MonotonicInstant},\ \texttt{UtcInstant},\ \texttt{TimeError}\} \\[0.16em]
\mathsf{AsyncTypeNames}\ =\ \{\texttt{Async},\ \texttt{Future},\ \texttt{Sequence},\ \texttt{Stream},\ \texttt{Pipe},\ \texttt{Exchange},\ \texttt{Tracked}\}
\end{array}
$$

`Drop`, `Bitcopy`, `Clone`, and `FfiSafe` are reserved predicate names and are included in `SpecialTypeNames`. Reuse of these names at any scope is an error via `(Intro-Outer-Err)` (§7.2), since `UniverseBindings` is the outermost scope and contains these names.

$$
\begin{array}{l}
\mathsf{PrimTypeKeys}\ =\ \{\operatorname{IdKey}(x)\ \mid \ x\ \in \ \mathsf{PrimTypeNames}\} \\[0.16em]
\mathsf{SpecialTypeKeys}\ =\ \{\operatorname{IdKey}(x)\ \mid \ x\ \in \ \mathsf{SpecialTypeNames}\} \\[0.16em]
\mathsf{AsyncTypeKeys}\ =\ \{\operatorname{IdKey}(x)\ \mid \ x\ \in \ \mathsf{AsyncTypeNames}\}
\end{array}
$$

$$
\operatorname{KeywordKey}(n)\ \Leftrightarrow \ \exists \ s.\ n\ =\ \operatorname{IdKey}(s)\ \land \ \operatorname{Keyword}(s)
$$
