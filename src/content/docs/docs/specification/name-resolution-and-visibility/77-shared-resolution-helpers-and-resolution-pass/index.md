---
title: "7.7 Shared Resolution Helpers and Resolution Pass"
description: "7.7 Shared Resolution Helpers and Resolution Pass from 7. Name Resolution and Visibility of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "name-resolution-and-visibility"
specSection: "77-shared-resolution-helpers-and-resolution-pass"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/name-resolution-and-visibility/">7. Name Resolution and Visibility</a>
  <span>Name Resolution and Visibility</span>
</div>

## 7.7 Shared Resolution Helpers and Resolution Pass

$$
\begin{array}{l}
P\ =\ \operatorname{Project}(\Gamma ) \\[0.16em]
m\ =\ \operatorname{CurrentModule}(\Gamma ) \\[0.16em]
M\ =\ \operatorname{ASTModule}(P,\ m) \\[0.16em]
\mathsf{ResolveInputs}\ =\ \langle M,\ \mathsf{ModulePaths},\ \{\ \operatorname{NameMap}(P,\ p)\ \mid \ p\ \in \ \mathsf{ModulePaths}\ \}\rangle  \\[0.16em]
\mathsf{ResolveOutputs}\ =\ \langle M'\rangle  \\[0.16em]
\mathsf{PathOfModuleRef}\ =\ \{\texttt{"3.4.1"}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeParamBindings}(\mathsf{params})\ =\ \{\ \operatorname{IdKey}(p.\mathsf{name})\ \mapsto \ \langle \mathsf{Type},\ \bot ,\ \bot ,\ \mathsf{Decl}\rangle \ \mid \ p\ \in \ \mathsf{params}\ \} \\[0.16em]
\operatorname{TypeParamBindings}(\bot )\ =\ \{\}
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveGenericParamsOpt}(\bot )\ \Downarrow \ \bot  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePredicateClauseOpt}(\bot )\ \Downarrow \ \bot  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveContractClauseOpt}(\bot )\ \Downarrow \ \bot  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\bot )\ \Downarrow \ \bot  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypeOpt}(\bot )\ \Downarrow \ \bot  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExprOpt}(\bot )\ \Downarrow \ \bot  \\[0.16em]
\operatorname{ResolveExprOpt}(\bot )\ =\ \bot  \\[0.16em]
\operatorname{ResolveExprOpt}(e)\ =\ e'\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'
\end{array}
$$

**(ResolveGenericParamsOpt-Yes)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypeParamList}(\mathsf{params})\ \Downarrow \ \mathsf{params}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveGenericParamsOpt}(\mathsf{params})\ \Downarrow \ \mathsf{params}'
\end{array}
$$

**(ResolveTypeParam)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveClassPathList}(\mathsf{bounds})\ \Downarrow \ \mathsf{bounds}'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeOpt}(\mathsf{default}_{\mathsf{opt}})\ \Downarrow \ \mathsf{default}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypeParam}(\langle \mathsf{name},\ \mathsf{bounds},\ \mathsf{default}_{\mathsf{opt}},\ \mathsf{variance}\rangle )\ \Downarrow \ \langle \mathsf{name},\ \mathsf{bounds}',\ \mathsf{default}_{\mathsf{opt}}',\ \mathsf{variance}\rangle 
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveTypeParamList}([])\ \Downarrow \ []
$$

**(ResolveTypeParamList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypeParam}(p)\ \Downarrow \ p'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeParamList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypeParamList}(p\ \mathbin{::} \ \mathsf{ps})\ \Downarrow \ p'\ \mathbin{::} \ \mathsf{ps}'
\end{array}
$$

**(ResolvePredicateClauseOpt-Yes)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePredicateReqList}(\mathsf{preds})\ \Downarrow \ \mathsf{preds}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePredicateClauseOpt}(\mathsf{preds})\ \Downarrow \ \mathsf{preds}'
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolvePredicateReqList}([])\ \Downarrow \ []
$$

**(ResolvePredicateReq-Predicate)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveType}(\mathsf{ty})\ \Downarrow \ \mathsf{ty}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePredicateReq}(\operatorname{PredicateReq}(\mathsf{pred},\ \mathsf{ty}))\ \Downarrow \ \operatorname{PredicateReq}(\mathsf{pred},\ \mathsf{ty}')
\end{array}
$$

**(ResolvePredicateReqList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePredicateReq}(p)\ \Downarrow \ p'\quad \Gamma \ \vdash \ \operatorname{ResolvePredicateReqList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePredicateReqList}(p\ \mathbin{::} \ \mathsf{ps})\ \Downarrow \ p'\ \mathbin{::} \ \mathsf{ps}'
\end{array}
$$

**(ResolveContractClauseOpt-Yes)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExprOpt}(\mathsf{pre})\ \Downarrow \ \mathsf{pre}'\quad \Gamma \ \vdash \ \operatorname{ResolveExprOpt}(\mathsf{post})\ \Downarrow \ \mathsf{post}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveContractClauseOpt}(\operatorname{ContractClause}(\mathsf{pre},\ \mathsf{post}))\ \Downarrow \ \operatorname{ContractClause}(\mathsf{pre}',\ \mathsf{post}')
\end{array}
$$

**(ResolveInvariantOpt-Yes)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{inv})\ \Downarrow \ \mathsf{inv}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{inv})\ \Downarrow \ \mathsf{inv}'
\end{array}
$$

**(ResolveTypePath-Ident)**
|path| = 1    Γ ⊢ ResolveTypeName(path[0]) ⇓ ent    ent.origin_opt = p    name = (ent.target_opt if present, else path[0])

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \operatorname{FullPath}(\operatorname{PathOfModule}(p),\ \mathsf{name})
\end{array}
$$

**(ResolveTypePath-Ident-Local)**
|path| = 1    Γ ⊢ ResolveTypeName(path[0]) ⇓ ent    ent.origin_opt = ⊥    name = (ent.target_opt if present, else path[0])

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ [\mathsf{name}]
\end{array}
$$

**(ResolveTypePath-Qual)**
|path| ≥ 2    path = p ++ [name]    Γ ⊢ ResolveQualified(p, name, TypeKind) ⇓ ent    ent.origin_opt = mp    name' = (ent.target_opt if present, else name)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \operatorname{FullPath}(\operatorname{PathOfModule}(\mathsf{mp}),\ \mathsf{name}')
\end{array}
$$

$$
\operatorname{LocalTypePath}(\mathsf{path})\ \Leftrightarrow \ \mid \mathsf{path}\mid \ =\ 1\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypeName}(\mathsf{path}[0])\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \bot 
$$

**(ResolveClassPath-Ident)**
|path| = 1    Γ ⊢ ResolveClassName(path[0]) ⇓ ent    ent.origin_opt = p    name = (ent.target_opt if present, else path[0])

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveClassPath}(\mathsf{path})\ \Downarrow \ \operatorname{FullPath}(\operatorname{PathOfModule}(p),\ \mathsf{name})
\end{array}
$$

**(ResolveClassPath-Qual)**
|path| ≥ 2    path = p ++ [name]    Γ ⊢ ResolveQualified(p, name, ClassKind) ⇓ ent    ent.origin_opt = mp    name' = (ent.target_opt if present, else name)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveClassPath}(\mathsf{path})\ \Downarrow \ \operatorname{FullPath}(\operatorname{PathOfModule}(\mathsf{mp}),\ \mathsf{name}')
\end{array}
$$

**(ResolveType-Path)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \mathsf{path}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{TypePath}(\mathsf{path}))\ \Downarrow \ \operatorname{TypePath}(\mathsf{path}')
\end{array}
$$

**(ResolveType-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveClassPath}(\mathsf{path})\ \Downarrow \ \mathsf{path}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{TypeDynamic}(\mathsf{path}))\ \Downarrow \ \operatorname{TypeDynamic}(\mathsf{path}')
\end{array}
$$

**(ResolveType-Apply)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \mathsf{path}'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeList}(\mathsf{args})\ \Downarrow \ \mathsf{args}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}))\ \Downarrow \ \operatorname{TypeApply}(\mathsf{path}',\ \mathsf{args}')
\end{array}
$$

**(ResolveType-ModalState)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveModalRef}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \mathsf{modal}_{\mathsf{ref}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}))\ \Downarrow \ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}}',\ \mathsf{state})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ResolveModalRef}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \mathsf{modal}_{\mathsf{ref}}'\ \Leftrightarrow  \\[0.16em]
\ (\mathsf{modal}_{\mathsf{ref}}\ =\ \operatorname{TypePath}(\mathsf{path})\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \mathsf{path}'\ \land \ \mathsf{modal}_{\mathsf{ref}}'\ =\ \operatorname{TypePath}(\mathsf{path}'))\ \lor  \\[0.16em]
\ (\mathsf{modal}_{\mathsf{ref}}\ =\ \operatorname{TypeApply}(\mathsf{path},\ \mathsf{args})\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \mathsf{path}'\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypeList}(\mathsf{args})\ \Downarrow \ \mathsf{args}'\ \land \ \mathsf{modal}_{\mathsf{ref}}'\ =\ \operatorname{TypeApply}(\mathsf{path}',\ \mathsf{args}'))
\end{array}
$$

**(ResolveType-Hom)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{ResolveType}(t_{i})\ \Downarrow \ t_{i}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{C}(t_{1},\ \ldots ,\ t_{n}))\ \Downarrow \ \operatorname{C}(t_{1}',\ \ldots ,\ t_{n}')
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveTypeList}([])\ \Downarrow \ []
$$

**(ResolveTypeList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveType}(t)\ \Downarrow \ t'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeList}(\mathsf{ts})\ \Downarrow \ \mathsf{ts}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypeList}(t\ \mathbin{::} \ \mathsf{ts})\ \Downarrow \ t'\ \mathbin{::} \ \mathsf{ts}'
\end{array}
$$

**(ResolveParam)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveType}(p.\mathsf{type})\ \Downarrow \ \mathsf{ty}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveParam}(p)\ \Downarrow \ p[\mathsf{type}\ =\ \mathsf{ty}']
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveParams}([])\ \Downarrow \ []
$$

**(ResolveParams-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveParam}(p)\ \Downarrow \ p'\quad \Gamma \ \vdash \ \operatorname{ResolveParams}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveParams}(p\ \mathbin{::} \ \mathsf{ps})\ \Downarrow \ p'\ \mathbin{::} \ \mathsf{ps}'
\end{array}
$$

$$
\mathsf{ResolvePattern}\ :\ \mathsf{Pattern}\ \rightharpoonup \ \mathsf{Pattern}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{WildcardPattern})\ \Downarrow \ \mathsf{WildcardPattern} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{IdentifierPattern}(x))\ \Downarrow \ \operatorname{IdentifierPattern}(x) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{LiteralPattern}(\mathsf{lit}))\ \Downarrow \ \operatorname{LiteralPattern}(\mathsf{lit})
\end{array}
$$

**(ResolvePat-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePatternList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{TuplePattern}(\mathsf{ps}))\ \Downarrow \ \operatorname{TuplePattern}(\mathsf{ps}')
\end{array}
$$

**(ResolvePat-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{tp})\ \Downarrow \ \mathsf{tp}'\quad \Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(\mathsf{io})\ \Downarrow \ \mathsf{io}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{RecordPattern}(\mathsf{tp},\ \mathsf{io}))\ \Downarrow \ \operatorname{RecordPattern}(\mathsf{tp}',\ \mathsf{io}')
\end{array}
$$

**(ResolvePat-Enum)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{tp})\ \Downarrow \ \mathsf{tp}'\quad \Gamma \ \vdash \ \operatorname{ResolveEnumPayloadPattern}(\mathsf{payload}_{\mathsf{opt}})\ \Downarrow \ \mathsf{payload}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{EnumPattern}(\mathsf{tp},\ \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{EnumPattern}(\mathsf{tp}',\ \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}}')
\end{array}
$$

**(ResolvePat-Modal)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternListOpt}(\mathsf{fields}_{\mathsf{opt}})\ \Downarrow \ \mathsf{fields}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{ModalPattern}(\mathsf{state},\ \mathsf{fields}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{ModalPattern}(\mathsf{state},\ \mathsf{fields}_{\mathsf{opt}}')
\end{array}
$$

**(ResolvePat-Range)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(p_{l})\ \Downarrow \ p_{l}'\quad \Gamma \ \vdash \ \operatorname{ResolvePattern}(p_{h})\ \Downarrow \ p_{h}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{RangePattern}(\mathsf{kind},\ p_{l},\ p_{h}))\ \Downarrow \ \operatorname{RangePattern}(\mathsf{kind},\ p_{l}',\ p_{h}')
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePatternList}([])\ \Downarrow \ [] \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}([])\ \Downarrow \ []
\end{array}
$$

**(ResolvePatternList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(p)\ \Downarrow \ p'\quad \Gamma \ \vdash \ \operatorname{ResolvePatternList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePatternList}(p\ \mathbin{::} \ \mathsf{ps})\ \Downarrow \ p'\ \mathbin{::} \ \mathsf{ps}'
\end{array}
$$

**(ResolveFieldPattern-Implicit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldPattern}(\langle \mathsf{name},\ \bot ,\ \mathsf{span}\rangle )\ \Downarrow \ \langle \mathsf{name},\ \bot ,\ \mathsf{span}\rangle 
\end{array}
$$

**(ResolveFieldPattern-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(p)\ \Downarrow \ p' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldPattern}(\langle \mathsf{name},\ p,\ \mathsf{span}\rangle )\ \Downarrow \ \langle \mathsf{name},\ p',\ \mathsf{span}\rangle 
\end{array}
$$

**(ResolveFieldPatternList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldPattern}(f)\ \Downarrow \ f'\quad \Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(\mathsf{io})\ \Downarrow \ \mathsf{io}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(f\ \mathbin{::} \ \mathsf{io})\ \Downarrow \ f'\ \mathbin{::} \ \mathsf{io}'
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveEnumPayloadPattern}(\bot )\ \Downarrow \ \bot 
$$

**(ResolveEnumPayloadPattern-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePatternList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumPayloadPattern}(\operatorname{TuplePayloadPattern}(\mathsf{ps}))\ \Downarrow \ \operatorname{TuplePayloadPattern}(\mathsf{ps}')
\end{array}
$$

**(ResolveEnumPayloadPattern-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(\mathsf{io})\ \Downarrow \ \mathsf{io}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumPayloadPattern}(\operatorname{RecordPayloadPattern}(\mathsf{io}))\ \Downarrow \ \operatorname{RecordPayloadPattern}(\mathsf{io}')
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternListOpt}(\bot )\ \Downarrow \ \bot 
$$

**(ResolveFieldPatternListOpt-Some)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(\mathsf{io})\ \Downarrow \ \mathsf{io}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternListOpt}(\mathsf{io})\ \Downarrow \ \mathsf{io}'
\end{array}
$$

**(ResolveExpr-Ident)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Identifier}(x))\ \Downarrow \ \operatorname{Identifier}(x)
\end{array}
$$

**(ResolveExpr-Ident-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{ResolveExpr}-\mathsf{Ident}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Identifier}(x))\ \Uparrow \ c
\end{array}
$$

**(ResolveExpr-Qualified)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ResolveArgsRef}\ =\ \{\texttt{"5.1.6"}\} \\[0.16em]
\mathsf{ResolveFieldInitsRef}\ =\ \{\texttt{"5.1.6"}\}
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveExprList}([])\ \Downarrow \ []
$$

**(ResolveExprList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma \ \vdash \ \operatorname{ResolveExprList}(\mathsf{es})\ \Downarrow \ \mathsf{es}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExprList}(e\ \mathbin{::} \ \mathsf{es})\ \Downarrow \ e'\ \mathbin{::} \ \mathsf{es}'
\end{array}
$$

$$
\mathsf{ResolveExprListJudg}\ =\ \{\mathsf{ResolveExprList}\}
$$

$$
\mathsf{ResolveEnumPayloadJudg}\ =\ \{\mathsf{ResolveEnumPayload}\}
$$

**(ResolveEnumPayload-None)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumPayload}(\bot )\ \Downarrow \ \bot 
\end{array}
$$

**(ResolveEnumPayload-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExprList}(\mathsf{es})\ \Downarrow \ \mathsf{es}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumPayload}(\operatorname{Paren}(\mathsf{es}))\ \Downarrow \ \operatorname{Paren}(\mathsf{es}')
\end{array}
$$

**(ResolveEnumPayload-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{fields})\ \Downarrow \ \mathsf{fields}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumPayload}(\operatorname{Brace}(\mathsf{fields}))\ \Downarrow \ \operatorname{Brace}(\mathsf{fields}')
\end{array}
$$

$$
\mathsf{ResolveKeyPathJudg}\ =\ \{\mathsf{ResolveKeyPathExpr},\ \mathsf{ResolveKeyPathList},\ \mathsf{ResolveKeySeg},\ \mathsf{ResolveKeySegs}\}
$$

**(ResolveKeySeg-Field)**

$$
\begin{array}{l}
\mathsf{seg}\ =\ \operatorname{Field}(\mathsf{marked},\ \mathsf{name}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeySeg}(\mathsf{seg})\ \Downarrow \ \mathsf{seg}
\end{array}
$$

**(ResolveKeySeg-Index)**

$$
\begin{array}{l}
\mathsf{seg}\ =\ \operatorname{Index}(\mathsf{marked},\ e)\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeySeg}(\mathsf{seg})\ \Downarrow \ \operatorname{Index}(\mathsf{marked},\ e')
\end{array}
$$

**(ResolveKeySegs-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeySegs}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveKeySegs-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveKeySeg}(s)\ \Downarrow \ s'\quad \Gamma \ \vdash \ \operatorname{ResolveKeySegs}(\mathsf{ss})\ \Downarrow \ \mathsf{ss}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeySegs}(s\ \mathbin{::} \ \mathsf{ss})\ \Downarrow \ s'\ \mathbin{::} \ \mathsf{ss}'
\end{array}
$$

**(ResolveKeyPathExpr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(\mathsf{root})\ \Downarrow \ \mathsf{ent}\quad \Gamma \ \vdash \ \operatorname{ResolveKeySegs}(\mathsf{segs})\ \Downarrow \ \mathsf{segs}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeyPathExpr}(\langle \mathsf{root},\ \mathsf{segs}\rangle )\ \Downarrow \ \langle \mathsf{root},\ \mathsf{segs}'\rangle 
\end{array}
$$

**(ResolveKeyPathExpr-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(\mathsf{root})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{ResolveExpr}-\mathsf{Ident}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeyPathExpr}(\langle \mathsf{root},\ \mathsf{segs}\rangle )\ \Uparrow \ c
\end{array}
$$

**(ResolveKeyPathList-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeyPathList}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveKeyPathList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveKeyPathExpr}(\mathsf{kp})\ \Downarrow \ \mathsf{kp}'\quad \Gamma \ \vdash \ \operatorname{ResolveKeyPathList}(\mathsf{kps})\ \Downarrow \ \mathsf{kps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeyPathList}(\mathsf{kp}\ \mathbin{::} \ \mathsf{kps})\ \Downarrow \ \mathsf{kp}'\ \mathbin{::} \ \mathsf{kps}'
\end{array}
$$

$$
\mathsf{ResolveParallelOptJudg}\ =\ \{\mathsf{ResolveParallelOpt},\ \mathsf{ResolveParallelOpts}\}
$$

**(ResolveParallelOpt-Cancel)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveParallelOpt}(\operatorname{Cancel}(e))\ \Downarrow \ \operatorname{Cancel}(e')
\end{array}
$$

**(ResolveParallelOpt-Name)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveParallelOpt}(\operatorname{Name}(s))\ \Downarrow \ \operatorname{Name}(s)
\end{array}
$$

**(ResolveParallelOpts-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveParallelOpts}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveParallelOpts-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveParallelOpt}(o)\ \Downarrow \ o'\quad \Gamma \ \vdash \ \operatorname{ResolveParallelOpts}(\mathsf{os})\ \Downarrow \ \mathsf{os}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveParallelOpts}(o\ \mathbin{::} \ \mathsf{os})\ \Downarrow \ o'\ \mathbin{::} \ \mathsf{os}'
\end{array}
$$

$$
\mathsf{ResolveSpawnOptJudg}\ =\ \{\mathsf{ResolveSpawnOpt},\ \mathsf{ResolveSpawnOpts}\}
$$

**(ResolveSpawnOpt-Name)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpt}(\operatorname{Name}(s))\ \Downarrow \ \operatorname{Name}(s)
\end{array}
$$

**(ResolveSpawnOpt-Affinity)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpt}(\operatorname{Affinity}(e))\ \Downarrow \ \operatorname{Affinity}(e')
\end{array}
$$

**(ResolveSpawnOpt-Priority)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpt}(\operatorname{Priority}(e))\ \Downarrow \ \operatorname{Priority}(e')
\end{array}
$$

**(ResolveSpawnOpts-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpts}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveSpawnOpts-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpt}(o)\ \Downarrow \ o'\quad \Gamma \ \vdash \ \operatorname{ResolveSpawnOpts}(\mathsf{os})\ \Downarrow \ \mathsf{os}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpts}(o\ \mathbin{::} \ \mathsf{os})\ \Downarrow \ o'\ \mathbin{::} \ \mathsf{os}'
\end{array}
$$

$$
\mathsf{ResolveDispatchOptJudg}\ =\ \{\mathsf{ResolveDispatchOpt},\ \mathsf{ResolveDispatchOpts}\}
$$

**(ResolveDispatchOpt-Reduce)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpt}(\operatorname{Reduce}(\mathsf{op}))\ \Downarrow \ \operatorname{Reduce}(\mathsf{op})
\end{array}
$$

**(ResolveDispatchOpt-Ordered)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpt}(\mathsf{Ordered})\ \Downarrow \ \mathsf{Ordered}
\end{array}
$$

**(ResolveDispatchOpt-Chunk)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpt}(\operatorname{Chunk}(e))\ \Downarrow \ \operatorname{Chunk}(e')
\end{array}
$$

**(ResolveDispatchOpts-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpts}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveDispatchOpts-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpt}(o)\ \Downarrow \ o'\quad \Gamma \ \vdash \ \operatorname{ResolveDispatchOpts}(\mathsf{os})\ \Downarrow \ \mathsf{os}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpts}(o\ \mathbin{::} \ \mathsf{os})\ \Downarrow \ o'\ \mathbin{::} \ \mathsf{os}'
\end{array}
$$

$$
\mathsf{ResolveRaceJudg}\ =\ \{\mathsf{ResolveRaceArm},\ \mathsf{ResolveRaceArms},\ \mathsf{ResolveRaceHandler}\}
$$

**(ResolveRaceHandler-Return)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceHandler}(\operatorname{RaceReturn}(e))\ \Downarrow \ \operatorname{RaceReturn}(e')
\end{array}
$$

**(ResolveRaceHandler-Yield)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceHandler}(\operatorname{RaceYield}(e))\ \Downarrow \ \operatorname{RaceYield}(e')
\end{array}
$$

**(ResolveRaceArm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(\mathsf{pat}')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveRaceHandler}(\mathsf{handler})\ \Downarrow \ \mathsf{handler}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceArm}(\langle e,\ \mathsf{pat},\ \mathsf{handler}\rangle )\ \Downarrow \ \langle e',\ \mathsf{pat}',\ \mathsf{handler}'\rangle 
\end{array}
$$

**(ResolveRaceArms-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveRaceArms-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRaceArm}(a)\ \Downarrow \ a'\quad \Gamma \ \vdash \ \operatorname{ResolveRaceArms}(\mathsf{as})\ \Downarrow \ \mathsf{as}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}(a\ \mathbin{::} \ \mathsf{as})\ \Downarrow \ a'\ \mathbin{::} \ \mathsf{as}'
\end{array}
$$

$$
\mathsf{ResolveAllExprListJudg}\ =\ \{\mathsf{ResolveAllExprList}\}
$$

**(ResolveAllExprList-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveAllExprList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma \ \vdash \ \operatorname{ResolveAllExprList}(\mathsf{es})\ \Downarrow \ \mathsf{es}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}(e\ \mathbin{::} \ \mathsf{es})\ \Downarrow \ e'\ \mathbin{::} \ \mathsf{es}'
\end{array}
$$

$$
\mathsf{ResolveCalleeJudg}\ =\ \{\mathsf{ResolveCallee}\}
$$

**(ResolveCallee-Ident-Value)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Identifier}(x),\ \mathsf{args})\ \Downarrow \ \operatorname{Identifier}(x)
\end{array}
$$

**(ResolveCallee-Ident-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Uparrow \quad \mathsf{args}\ =\ []\quad \Gamma \ \vdash \ \operatorname{ResolveTypeName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ p\quad \mathsf{name}\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ x)\quad \operatorname{RecordDecl}(\operatorname{FullPath}(\operatorname{PathOfModule}(p),\ \mathsf{name}))\ =\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Identifier}(x),\ \mathsf{args})\ \Downarrow \ \operatorname{Identifier}(x)
\end{array}
$$

**(ResolveCallee-Path-Value)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}),\ \mathsf{args})\ \Downarrow \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})
\end{array}
$$

**(ResolveCallee-Path-Builtin)**
BuiltinValuePath(path, name)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}),\ \mathsf{args})\ \Downarrow \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})
\end{array}
$$

**(ResolveCallee-Path-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p\quad \mathsf{args}\ =\ [] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}),\ \mathsf{args})\ \Downarrow \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})
\end{array}
$$

**(ResolveCallee-Other)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{callee})\ \Downarrow \ \mathsf{callee}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\mathsf{callee},\ \mathsf{args})\ \Downarrow \ \mathsf{callee}'
\end{array}
$$

**(ResolveExpr-Call)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveArgs}(\mathsf{args})\ \Downarrow \ \mathsf{args}'\quad \Gamma \ \vdash \ \operatorname{ResolveCallee}(\mathsf{callee},\ \mathsf{args}')\ \Downarrow \ \mathsf{callee}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}))\ \Downarrow \ \operatorname{Call}(\mathsf{callee}',\ \mathsf{args}')
\end{array}
$$

**(ResolveExpr-Call-TypeArgs)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypeList}(\mathsf{type}_{\mathsf{args}})\ \Downarrow \ \mathsf{type}_{\mathsf{args}}'\quad \Gamma \ \vdash \ \operatorname{ResolveArgs}(\mathsf{args})\ \Downarrow \ \mathsf{args}'\quad \Gamma \ \vdash \ \operatorname{ResolveCallee}(\mathsf{callee},\ \mathsf{args}')\ \Downarrow \ \mathsf{callee}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{CallTypeArgs}(\mathsf{callee},\ \mathsf{type}_{\mathsf{args}},\ \mathsf{args}))\ \Downarrow \ \operatorname{CallTypeArgs}(\mathsf{callee}',\ \mathsf{type}_{\mathsf{args}}',\ \mathsf{args}')
\end{array}
$$

**(ResolveExpr-RecordExpr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypeRef}(\mathsf{tr})\ \Downarrow \ \mathsf{tr}'\quad \Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{fields})\ \Downarrow \ \mathsf{fields}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{RecordExpr}(\mathsf{tr},\ \mathsf{fields}))\ \Downarrow \ \operatorname{RecordExpr}(\mathsf{tr}',\ \mathsf{fields}')
\end{array}
$$

**(ResolveExpr-EnumLiteral)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveEnumPayload}(\mathsf{payload}_{\mathsf{opt}})\ \Downarrow \ \mathsf{payload}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{EnumLiteral}(\mathsf{path},\ \mathsf{payload}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{EnumLiteral}(\mathsf{path},\ \mathsf{payload}_{\mathsf{opt}}')
\end{array}
$$

$$
\mathsf{ResolveIfCaseJudg}\ =\ \{\mathsf{ResolveIfCase},\ \mathsf{ResolveIfCases},\ \mathsf{ResolveElseBlockOpt}\}
$$

**(ResolveIfCase)**

$$
\begin{array}{l}
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{ResolvePattern}(p)\ \Downarrow \ p'\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(p')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(b)\ \Downarrow \ b' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveIfCase}(\langle p,\ b\rangle )\ \Downarrow \ \langle p',\ b'\rangle 
\end{array}
$$

**(ResolveIfCases-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveIfCases}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveIfCases-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveIfCase}(a)\ \Downarrow \ a'\quad \Gamma \ \vdash \ \operatorname{ResolveIfCases}(\mathsf{as})\ \Downarrow \ \mathsf{as}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveIfCases}(a\ \mathbin{::} \ \mathsf{as})\ \Downarrow \ a'\ \mathbin{::} \ \mathsf{as}'
\end{array}
$$

**(ResolveElseBlockOpt-None)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveElseBlockOpt}(\bot )\ \Downarrow \ \bot 
\end{array}
$$

**(ResolveElseBlockOpt-Some)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(b)\ \Downarrow \ b' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveElseBlockOpt}(b)\ \Downarrow \ b'
\end{array}
$$

**(ResolveExpr-IfIs)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{scrutinee})\ \Downarrow \ \mathsf{scrutinee}'\quad \Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(\mathsf{pat}')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(\mathsf{then}_{\mathsf{block}})\ \Downarrow \ \mathsf{then}_{\mathsf{block}}'\quad \Gamma \ \vdash \ \operatorname{ResolveElseBlockOpt}(\mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \mathsf{else}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{IfIsExpr}(\mathsf{scrutinee},\ \mathsf{pat},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{IfIsExpr}(\mathsf{scrutinee}',\ \mathsf{pat}',\ \mathsf{then}_{\mathsf{block}}',\ \mathsf{else}_{\mathsf{opt}}')
\end{array}
$$

**(ResolveExpr-IfCase)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{scrutinee})\ \Downarrow \ \mathsf{scrutinee}'\quad \Gamma \ \vdash \ \operatorname{ResolveIfCases}(\mathsf{cases})\ \Downarrow \ \mathsf{cases}'\quad \Gamma \ \vdash \ \operatorname{ResolveElseBlockOpt}(\mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \mathsf{else}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{IfCaseExpr}(\mathsf{scrutinee},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{IfCaseExpr}(\mathsf{scrutinee}',\ \mathsf{cases}',\ \mathsf{else}_{\mathsf{opt}}')
\end{array}
$$

**(ResolveExpr-LoopInfinite)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{inv}_{\mathsf{opt}})\ \Downarrow \ \mathsf{inv}_{\mathsf{opt}}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ \Downarrow \ \operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}}',\ \mathsf{body}')
\end{array}
$$

**(ResolveExpr-LoopConditional)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{cond})\ \Downarrow \ \mathsf{cond}'\quad \Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{inv}_{\mathsf{opt}})\ \Downarrow \ \mathsf{inv}_{\mathsf{opt}}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ \Downarrow \ \operatorname{LoopConditional}(\mathsf{cond}',\ \mathsf{inv}_{\mathsf{opt}}',\ \mathsf{body}')
\end{array}
$$

**(ResolveExpr-LoopIter)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeOpt}(\mathsf{ty}_{\mathsf{opt}})\ \Downarrow \ \mathsf{ty}_{\mathsf{opt}}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{iter})\ \Downarrow \ \mathsf{iter}'\quad \Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{inv}_{\mathsf{opt}})\ \Downarrow \ \mathsf{inv}_{\mathsf{opt}}'\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(\mathsf{pat}')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ \Downarrow \ \operatorname{LoopIter}(\mathsf{pat}',\ \mathsf{ty}_{\mathsf{opt}}',\ \mathsf{iter}',\ \mathsf{inv}_{\mathsf{opt}}',\ \mathsf{body}')
\end{array}
$$

**(ResolveExpr-Parallel)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{domain})\ \Downarrow \ \mathsf{domain}'\quad \Gamma \ \vdash \ \operatorname{ResolveParallelOpts}(\mathsf{opts})\ \Downarrow \ \mathsf{opts}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{ParallelExpr}(\mathsf{domain},\ \mathsf{opts},\ \mathsf{body}))\ \Downarrow \ \operatorname{ParallelExpr}(\mathsf{domain}',\ \mathsf{opts}',\ \mathsf{body}')
\end{array}
$$

**(ResolveExpr-Spawn)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpts}(\mathsf{opts})\ \Downarrow \ \mathsf{opts}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{SpawnExpr}(\mathsf{opts},\ \mathsf{body}))\ \Downarrow \ \operatorname{SpawnExpr}(\mathsf{opts}',\ \mathsf{body}')
\end{array}
$$

**(ResolveExpr-Wait)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{handle})\ \Downarrow \ \mathsf{handle}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{WaitExpr}(\mathsf{handle}))\ \Downarrow \ \operatorname{WaitExpr}(\mathsf{handle}')
\end{array}
$$

$$
\mathsf{ResolveKeyClauseJudg}\ =\ \{\mathsf{ResolveKeyClauseOpt}\}
$$

**(ResolveKeyClauseOpt-None)**

$$
\begin{array}{l}
\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}}\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeyClauseOpt}(\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \bot 
\end{array}
$$

**(ResolveKeyClauseOpt-Yes)**

$$
\begin{array}{l}
\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}}\ =\ \langle \mathsf{path},\ \mathsf{mode}\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveKeyPathExpr}(\mathsf{path})\ \Downarrow \ \mathsf{path}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeyClauseOpt}(\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \langle \mathsf{path}',\ \mathsf{mode}\rangle 
\end{array}
$$

**(ResolveExpr-Dispatch)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{range})\ \Downarrow \ \mathsf{range}'\quad \Gamma \ \vdash \ \operatorname{ResolveKeyClauseOpt}(\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}}'\quad \Gamma \ \vdash \ \operatorname{ResolveDispatchOpts}(\mathsf{opts})\ \Downarrow \ \mathsf{opts}'\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(\mathsf{pat}')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body}))\ \Downarrow \ \operatorname{DispatchExpr}(\mathsf{pat}',\ \mathsf{range}',\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}}',\ \mathsf{opts}',\ \mathsf{body}')
\end{array}
$$

**(ResolveExpr-Yield)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ \Downarrow \ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e')
\end{array}
$$

**(ResolveExpr-YieldFrom)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ \Downarrow \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e')
\end{array}
$$

**(ResolveExpr-Sync)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{SyncExpr}(e))\ \Downarrow \ \operatorname{SyncExpr}(e')
\end{array}
$$

**(ResolveExpr-Race)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}(\mathsf{arms})\ \Downarrow \ \mathsf{arms}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{RaceExpr}(\mathsf{arms}))\ \Downarrow \ \operatorname{RaceExpr}(\mathsf{arms}')
\end{array}
$$

**(ResolveExpr-All)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}(\mathsf{es})\ \Downarrow \ \mathsf{es}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{AllExpr}(\mathsf{es}))\ \Downarrow \ \operatorname{AllExpr}(\mathsf{es}')
\end{array}
$$

**(ResolveExpr-Alloc-Explicit-ByAlias)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(r)\ \Downarrow \ \mathsf{ent}\quad \operatorname{RegionAlias}(\mathsf{ent})\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Binary}(\texttt{"\^{}"},\ \operatorname{Identifier}(r),\ e))\ \Downarrow \ \operatorname{AllocExpr}(r,\ e')
\end{array}
$$

$$
\mathsf{ResolveExprRules}\ =\ \{\mathsf{ResolveExpr}-\mathsf{Ident},\ \mathsf{ResolveExpr}-\mathsf{Qualified},\ \mathsf{ResolveExpr}-\mathsf{Call},\ \mathsf{ResolveExpr}-\mathsf{Call}-\mathsf{TypeArgs},\ \mathsf{ResolveExpr}-\mathsf{RecordExpr},\ \mathsf{ResolveExpr}-\mathsf{EnumLiteral},\ \mathsf{ResolveExpr}-\mathsf{IfCase},\ \mathsf{ResolveExpr}-\mathsf{LoopIter},\ \mathsf{ResolveExpr}-\mathsf{Parallel},\ \mathsf{ResolveExpr}-\mathsf{Spawn},\ \mathsf{ResolveExpr}-\mathsf{Wait},\ \mathsf{ResolveExpr}-\mathsf{Dispatch},\ \mathsf{ResolveExpr}-\mathsf{Yield},\ \mathsf{ResolveExpr}-\mathsf{YieldFrom},\ \mathsf{ResolveExpr}-\mathsf{Sync},\ \mathsf{ResolveExpr}-\mathsf{Race},\ \mathsf{ResolveExpr}-\mathsf{All},\ \mathsf{ResolveExpr}-\mathsf{Alloc}-\mathsf{Explicit}-\mathsf{ByAlias},\ \mathsf{ResolveExpr}-\mathsf{Hom},\ \mathsf{ResolveExpr}-\mathsf{Alloc}-\mathsf{Implicit},\ \mathsf{ResolveExpr}-\mathsf{Alloc}-\mathsf{Explicit},\ \mathsf{ResolveExpr}-\mathsf{Block}\}
$$

$$
\operatorname{NoSpecificResolveExpr}(e)\ \Leftrightarrow \ \lnot \ \exists \ r\ \in \ \mathsf{ResolveExprRules}\ \setminus \ \{\mathsf{ResolveExpr}-\mathsf{Hom}\}.\ \operatorname{PremisesHold}(r,\ e)
$$

**(ResolveExpr-Hom)**

$$
\begin{array}{l}
\operatorname{NoSpecificResolveExpr}(\operatorname{C}(e_{1},\ \ldots ,\ e_{n}))\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{ResolveExpr}(e_{i})\ \Downarrow \ e_{i}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{C}(e_{1},\ \ldots ,\ e_{n}))\ \Downarrow \ \operatorname{C}(e_{1}',\ \ldots ,\ e_{n}')
\end{array}
$$

**(ResolveExpr-Alloc-Implicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{AllocExpr}(\bot ,\ e))\ \Downarrow \ \operatorname{AllocExpr}(\bot ,\ e')
\end{array}
$$

**(ResolveExpr-Alloc-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(r)\ \Downarrow \ \mathsf{ent}\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{AllocExpr}(r,\ e))\ \Downarrow \ \operatorname{AllocExpr}(r,\ e')
\end{array}
$$

$$
\mathsf{ResolveStmtSeqJudg}\ =\ \{\mathsf{ResolveStmtSeq}\}
$$

**(ResolveStmtSeq-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveStmtSeq}([])\ \Downarrow \ (\Gamma ,\ [])
\end{array}
$$

**(ResolveStmtSeq-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveStmt}(s)\ \Downarrow \ (\Gamma_{1} ,\ s')\quad \Gamma_{1} \ \vdash \ \operatorname{ResolveStmtSeq}(\mathsf{ss})\ \Downarrow \ (\Gamma_{2} ,\ \mathsf{ss}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveStmtSeq}(s\ \mathbin{::} \ \mathsf{ss})\ \Downarrow \ (\Gamma_{2} ,\ s'\ \mathbin{::} \ \mathsf{ss}')
\end{array}
$$

**(ResolveExpr-Block)**

$$
\begin{array}{l}
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{ResolveStmtSeq}(\mathsf{stmts})\ \Downarrow \ (\Gamma_{1} ,\ \mathsf{stmts}')\quad (\mathsf{tail}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ \mathsf{tail}_{\mathsf{opt}}'\ =\ \bot )\quad (\mathsf{tail}_{\mathsf{opt}}\ =\ e\ \Rightarrow \ \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\ \land \ \mathsf{tail}_{\mathsf{opt}}'\ =\ e') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{BlockExpr}(\mathsf{stmts}',\ \mathsf{tail}_{\mathsf{opt}}')
\end{array}
$$

**(Validate-ModulePath-Ok)**

$$
\begin{array}{l}
\lnot \ \operatorname{ReservedModulePath}(\operatorname{PathOfModule}(p)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValidateModulePath}(p)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Validate-ModulePath-Reserved-Err)**

$$
\begin{array}{l}
\operatorname{ReservedModulePath}(\operatorname{PathOfModule}(p))\quad c\ =\ \operatorname{Code}(\mathsf{Validate}-\mathsf{ModulePath}-\mathsf{Reserved}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValidateModulePath}(p)\ \Uparrow \ c
\end{array}
$$

`ResolveItem` is a feature-owned judgment. Chapters 11 through 22 define the feature-specific `ResolveItem` clauses; this chapter defines the shared driver and helper relations they consume.

**(ResolveModule-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N\quad \Gamma \ \vdash \ \operatorname{ValidateModulePath}(M.\mathsf{path})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ValidateModuleNames}(N)\ \Downarrow \ \mathsf{ok}\quad S_{\mathsf{module}}\ =\ N\quad \Gamma_{N} \ =\ [S_{\mathsf{module}},\ S_{\mathsf{universe}}]\quad \Gamma_{N} \ \vdash \ \operatorname{ResolveItems}(M.\mathsf{items})\ \Downarrow \ \mathsf{items}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveModule}(M)\ \Downarrow \ \langle M.\mathsf{path},\ \mathsf{items}',\ M.\mathsf{module}_{\mathsf{doc}}\rangle 
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveItems}([])\ \Downarrow \ []
$$

**(ResolveItems-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TopLevelVis}(\mathsf{it})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ResolveItem}(\mathsf{it})\ \Downarrow \ \mathsf{it}'\quad \Gamma \ \vdash \ \operatorname{ResolveItems}(\mathsf{rest})\ \Downarrow \ \mathsf{rest}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveItems}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest})\ \Downarrow \ \mathsf{it}'\ \mathbin{::} \ \mathsf{rest}'
\end{array}
$$

$$
\mathsf{ResState}\ =\ \{\operatorname{ResStart}(M),\ \operatorname{ResNames}(M,\ N),\ \operatorname{ResItems}(M,\ N),\ \operatorname{ResDone}(M'),\ \operatorname{Error}(\mathsf{code})\}
$$

**(Res-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ResStart}(M)\rangle \ \to \ \langle \operatorname{ResNames}(M,\ \_)\rangle 
\end{array}
$$

**(Res-Names)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ResNames}(M,\ \_)\rangle \ \to \ \langle \operatorname{ResItems}(M,\ N)\rangle 
\end{array}
$$

**(Res-Items)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveModule}(M)\ \Downarrow \ M' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ResItems}(M,\ N)\rangle \ \to \ \langle \operatorname{ResDone}(M')\rangle 
\end{array}
$$

**ResolveModules (Big-Step).**

**(ResolveModules-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ [M_{1},\ \ldots ,\ M_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{ResolveModule}(M_{i})\ \Downarrow \ M_{i}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveModules}(P)\ \Downarrow \ [M_{1}',\ \ldots ,\ M_{k}']
\end{array}
$$

**(ResolveModules-Err-Parse)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveModules}(P)\ \Uparrow \ c
\end{array}
$$

**(ResolveModules-Err-Resolve)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ [M_{1},\ \ldots ,\ M_{k}]\quad \exists \ i.\ \Gamma \ \vdash \ \operatorname{ResolveModule}(M_{i})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveModules}(P)\ \Uparrow \ c
\end{array}
$$
