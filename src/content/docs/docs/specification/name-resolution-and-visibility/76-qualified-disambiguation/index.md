---
title: "7.6 Qualified Disambiguation"
description: "7.6 Qualified Disambiguation from 7. Name Resolution and Visibility of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "name-resolution-and-visibility"
specSection: "76-qualified-disambiguation"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/name-resolution-and-visibility/">7. Name Resolution and Visibility</a>
  <span>Name Resolution and Visibility</span>
</div>

## 7.6 Qualified Disambiguation

$$
\begin{array}{l}
\mathsf{ResolveQualifiedForm}\ :\ \mathsf{Expr}\ \rightharpoonup \ \mathsf{Expr} \\[0.16em]
\mathsf{ResolveArgs}\ :\ [\mathsf{Arg}]\ \rightharpoonup \ [\mathsf{Arg}] \\[0.16em]
\mathsf{ResolveFieldInits}\ :\ [\mathsf{FieldInit}]\ \rightharpoonup \ [\mathsf{FieldInit}] \\[0.16em]
\mathsf{ResolveRecordPath}\ :\ \mathsf{Path}\ \times \ \mathsf{Identifier}\ \rightharpoonup \ \mathsf{Path} \\[0.16em]
\mathsf{ResolveEnumUnit}\ :\ \mathsf{Path}\ \times \ \mathsf{Identifier}\ \rightharpoonup \ \mathsf{Path} \\[0.16em]
\mathsf{ResolveEnumTuple}\ :\ \mathsf{Path}\ \times \ \mathsf{Identifier}\ \rightharpoonup \ \mathsf{Path} \\[0.16em]
\mathsf{ResolveEnumRecord}\ :\ \mathsf{Path}\ \times \ \mathsf{Identifier}\ \rightharpoonup \ \mathsf{Path} \\[0.16em]
\mathsf{ResolvePathJudg}\ =\ \{\mathsf{ResolveRecordPath},\ \mathsf{ResolveEnumUnit},\ \mathsf{ResolveEnumTuple},\ \mathsf{ResolveEnumRecord}\}
\end{array}
$$

**(ResolveArgs-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveArgs}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveArgs-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma \ \vdash \ \operatorname{ResolveArgs}(\mathsf{rest})\ \Downarrow \ \mathsf{rest}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveArgs}([\langle \mathsf{pass},\ e,\ \mathsf{span}\rangle ]\ \mathbin{++} \ \mathsf{rest})\ \Downarrow \ [\langle \mathsf{pass},\ e',\ \mathsf{span}\rangle ]\ \mathbin{++} \ \mathsf{rest}'
\end{array}
$$

**(ResolveFieldInits-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveFieldInits-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{rest})\ \Downarrow \ \mathsf{rest}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}([\langle f,\ e\rangle ]\ \mathbin{++} \ \mathsf{rest})\ \Downarrow \ [\langle f,\ e'\rangle ]\ \mathbin{++} \ \mathsf{rest}'
\end{array}
$$

**(Resolve-RecordPath)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path}\ \mathbin{++} \ [\mathsf{name}])\ \Downarrow \ p\quad \operatorname{RecordDecl}(p)\ =\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(Resolve-EnumUnit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(Resolve-EnumTuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \operatorname{TuplePayload}(\_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumTuple}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(Resolve-EnumRecord)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \operatorname{RecordPayload}(\_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumRecord}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

$$
\operatorname{BuiltinValuePath}(\mathsf{path},\ \mathsf{name})\ \Leftrightarrow \ \operatorname{BuiltinModalStaticSig}(\mathsf{path},\ \mathsf{name})\ \mathsf{defined}
$$

**(ResolveQual-Name-Builtin)**
BuiltinValuePath(path, name)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})
\end{array}
$$

**(ResolveQual-Name-Value)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\quad \operatorname{PathOfModule}(\mathsf{mp})\ =\ \mathsf{path}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{Path}(\mathsf{path}',\ \mathsf{name}')
\end{array}
$$

**(ResolveQual-Name-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p\quad \operatorname{SplitLast}(p)\ =\ (\mathsf{mp},\ \mathsf{name}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{Path}(\mathsf{mp},\ \mathsf{name}')
\end{array}
$$

**(ResolveQual-Name-Enum)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{EnumLiteral}(\operatorname{FullPath}(p,\ \mathsf{name}),\ \bot )
\end{array}
$$

**(ResolveQual-Name-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad c\ =\ \operatorname{Code}(\mathsf{ResolveExpr}-\mathsf{Ident}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Uparrow \ c
\end{array}
$$
