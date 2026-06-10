---
title: "6.4 Regions, Frames, and Provenance"
description: "6.4 Regions, Frames, and Provenance from 6. Abstract Machine, Objects, Responsibility, and Authority of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "abstract-machine-objects-responsibility-and-authority"
specSection: "64-regions-frames-and-provenance"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/">6. Abstract Machine, Objects, Responsibility, and Authority</a>
  <span>Abstract Machine, Objects, Responsibility, and Authority</span>
</div>

## 6.4 Regions, Frames, and Provenance

### 6.4.1 Built-In Region Options and Region Helpers

$$
\begin{array}{l}
\mathsf{RegionOptionsFields}\ =\ [ \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{stack\_size},\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{Literal}(\operatorname{IntLiteral}(0)),\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{name},\ \operatorname{TypeString}(\bot ),\ \operatorname{Literal}(\operatorname{StringLiteral}(\texttt{"\textbackslash{}""})),\ \bot ,\ \bot \rangle \\[0.16em]
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
\ \{\ \mathsf{alias}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{alias}_{\mathsf{opt}}\ \ne \ \bot \\[0.16em]
\quad \operatorname{FreshRegion}(\Gamma )\quad \mathsf{otherwise}\ \}\ \land \ \operatorname{IntroAll}(\Gamma ,\ [\langle r,\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{Region}],\ \texttt{Active}))\rangle ])\ \Downarrow \ \Gamma_{r}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{InnermostActiveRegion}([])\ =\ \bot \\[0.16em]
\operatorname{InnermostActiveRegion}([\sigma ]\ \mathbin{++} \ \Gamma ')\ = \\[0.16em]
\ \{\ r\quad \mathsf{if}\ \exists \ r.\ r\ \in \ \operatorname{dom}(\sigma )\ \land \ \operatorname{RegionActiveType}(\sigma [r]) \\[0.16em]
\quad \operatorname{InnermostActiveRegion}(\Gamma ')\ \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FrameBind}(\Gamma ,\ \mathsf{target}_{\mathsf{opt}})\ =\ \Gamma_{f} \ \Leftrightarrow \ r\ = \\[0.16em]
\ \{\ \operatorname{InnermostActiveRegion}(\Gamma )\quad \mathsf{if}\ \mathsf{target}_{\mathsf{opt}}\ =\ \bot \\[0.16em]
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
\ \{\ \pi_{1} \quad \mathsf{if}\ \pi_{1} \ \le \ \pi_{2} \\[0.16em]
\quad \pi_{2} \quad \mathsf{if}\ \pi_{2} \ \le \ \pi_{1} \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{JoinAllProv}([])\ =\ \bot \\[0.16em]
\operatorname{JoinAllProv}([\pi ])\ =\ \pi \\[0.16em]
\operatorname{JoinAllProv}([\pi_{1} ,\ \pi_{2} ]\ \mathbin{++} \ \mathsf{ps})\ =\ \operatorname{JoinAllProv}([\operatorname{JoinProv}(\pi_{1} ,\ \pi_{2} )]\ \mathbin{++} \ \mathsf{ps})
\end{array}
$$

### 6.4.3 Provenance Environment

$$
\begin{array}{l}
\Omega \ =\ \langle \Sigma \_\pi ,\ \mathsf{RS}\rangle \\[0.16em]
\mathsf{Scope}\_\pi \ =\ \langle S,\ M\rangle \ \mathsf{where}\ M\ :\ \mathsf{Ident}\ \rightharpoonup \ \pi \\[0.16em]
\Sigma \_\pi \ \in \ [\mathsf{Scope}\_\pi ] \\[0.16em]
\mathsf{RegionEntry}\_\pi \ =\ \langle \mathsf{tag},\ \mathsf{target}\rangle \\[0.16em]
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
\mathsf{IntroAll}\_\pi (\Sigma \_\pi ,\ [],\ \pi )\ =\ \Sigma \_\pi \\[0.16em]
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
\mathsf{ResolveEntry}\_\pi ([],\ \mathsf{tag})\ =\ \bot \\[0.16em]
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
\operatorname{AllocTag}([],\ r)\ =\ \bot \\[0.16em]
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
\operatorname{CaseBodyProv}(e,\ \Omega )\ =\ \pi \ \Leftrightarrow \ \Gamma ;\ \Omega \ \vdash \ e\ \Downarrow \ \pi \\[0.16em]
\operatorname{CaseBodyProv}(b,\ \Omega )\ =\ \pi \ \Leftrightarrow \ \Gamma ;\ \Omega \ \vdash \ b\ \Downarrow \ \pi \\[0.16em]
\operatorname{CaseEnv}(\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle ,\ \mathsf{pat})\ =\ \langle \Sigma \_\pi ',\ \mathsf{RS}\rangle \ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{pat})\ \Downarrow \ N\ \land \ \pi_{b} \ =\ \operatorname{BindProv}(\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle ,\ \bot )\ \land \ \Sigma \_\pi '\ =\ \mathsf{IntroAll}\_\pi (\Sigma \_\pi ,\ N,\ \pi_{b} ) \\[0.16em]
\operatorname{CaseProv}(\langle \mathsf{pat},\ \mathsf{body}\rangle )\ =\ \pi \ \Leftrightarrow \ \operatorname{CaseEnv}(\Omega ,\ \mathsf{pat})\ =\ \Omega '\ \land \ \operatorname{CaseBodyProv}(\mathsf{body},\ \Omega ')\ =\ \pi \\[0.16em]
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
\operatorname{CaseProv}(\langle \mathsf{pat},\ \mathsf{then}_{\mathsf{block}}\rangle )\ =\ \pi_{t} \quad \operatorname{CaseElseProv}(\mathsf{else}_{\mathsf{opt}},\ \Omega )\ =\ \pi_{\mathsf{else}} \quad \operatorname{JoinAllProv}([\pi_{t} ]\ \mathbin{++} \ \pi_{\mathsf{else}} )\ =\ \pi \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \operatorname{IfIsExpr}(\_,\ \mathsf{pat},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \pi
\end{array}
$$

**(P-If-Cases)**

$$
\begin{array}{l}
\forall \ i,\ \operatorname{CaseProv}(\mathsf{case}_{i})\ =\ \pi_{i} \quad \operatorname{CaseElseProv}(\mathsf{else}_{\mathsf{opt}},\ \Omega )\ =\ \pi_{\mathsf{else}} \quad \operatorname{JoinAllProv}([\pi_{1} ,\ \ldots ,\ \pi_{n} ]\ \mathbin{++} \ \pi_{\mathsf{else}} )\ =\ \pi \\[0.16em]
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
\operatorname{ClosureEscapeCheck}(C,\ \Omega )\ \Leftrightarrow \\[0.16em]
\ (\forall \ \pi_{x} \ \in \ \operatorname{ClosureCaptureProv}(C,\ \Omega ).\ \lnot (\pi_{x} \ <\ \operatorname{ClosureTargetProv}(C,\ \Omega )))\ \land \\[0.16em]
\ (\lnot \operatorname{IsEscaping}(C)\ \lor \ \operatorname{ClosureLocalSharedCaptures}(C,\ \Gamma )\ =\ \emptyset )
\end{array}
$$

**(P-Closure-NonCapturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset \quad \Gamma ;\ \Omega \ \vdash \ \mathsf{body}\ \Downarrow \ \pi_{\mathsf{body}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ C\ \Downarrow \ \pi_{\mathsf{Global}}
\end{array}
$$

**(P-Closure-Capturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset \quad \operatorname{ClosureEscapeCheck}(C,\ \Omega ) \\[0.16em]
\operatorname{ClosureCaptureProv}(C,\ \Omega )\ =\ [\pi_{1} ,\ \ldots ,\ \pi_{n} ]\quad \operatorname{JoinAllProv}([\pi_{1} ,\ \ldots ,\ \pi_{n} ])\ =\ \pi_{\mathsf{cap}} \quad \Gamma ;\ \Omega \ \vdash \ \mathsf{body}\ \Downarrow \ \pi_{\mathsf{body}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ C\ \Downarrow \ \pi_{\mathsf{cap}}
\end{array}
$$

**(P-Closure-Escape-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset \quad \lnot \operatorname{ClosureEscapeCheck}(C,\ \Omega ) \\[0.16em]
\exists \ x\ \in \ \operatorname{CaptureSet}(C).\ x\ \in \ \operatorname{ClosureLocalSharedCaptures}(C,\ \Gamma )\ \lor \ (\mathsf{Lookup}\_\pi (\Sigma \_\pi ,\ x)\ =\ \pi_{x} \ \land \ \pi_{x} \ <\ \operatorname{ClosureTargetProv}(C,\ \Omega ))\quad c\ =\ \operatorname{Code}(P-\mathsf{Closure}-\mathsf{Escape}-\mathsf{Err}) \\[0.16em]
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
\operatorname{BreakProv}(\mathsf{body},\ \Omega )\ =\ \langle \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopProvInf}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ \pi \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \Downarrow \ \pi
\end{array}
$$

**(P-Loop-Conditional)**

$$
\begin{array}{l}
\operatorname{BreakProv}(\mathsf{body},\ \Omega )\ =\ \langle \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopProvFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ \pi \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \Downarrow \ \pi
\end{array}
$$

**(P-Loop-Iter)**

$$
\begin{array}{l}
\operatorname{IterElemProv}(\mathsf{iter},\ \Omega )\ =\ \pi_{\mathsf{elem}} \quad \operatorname{ExtendProv}(\Omega ,\ \mathsf{pat},\ \pi_{\mathsf{elem}} )\ =\ \Omega '\quad \operatorname{BreakProv}(\mathsf{body},\ \Omega ')\ =\ \langle \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopProvFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ \pi \\[0.16em]
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
\ \{\ \operatorname{StackProv}(\Sigma \_\pi )\quad \mathsf{if}\ \pi_{\mathsf{init}} \ =\ \bot \\[0.16em]
\quad \pi_{\mathsf{init}} \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{StaticBindProv}\ =\ \pi_{\mathsf{Global}} \\[0.16em]
\operatorname{AssignProvOk}(\Omega ,\ p,\ e)\ \Leftrightarrow \ \Gamma ;\ \Omega \ \vdash \ p\ \Downarrow \ \pi_{x} \ \land \ \Gamma ;\ \Omega \ \vdash \ e\ \Downarrow \ \pi_{e} \ \land \ \operatorname{EscapeOk}(\pi_{e} ,\ \pi_{x} ) \\[0.16em]
\mathsf{ProvenanceEscapeJudg}\ =\ \{\mathsf{EscapeOk},\ \mathsf{AssignProvOk},\ \mathsf{ClosureEscapeCheck}\}
\end{array}
$$

The provenance system prevents pointers with shorter lifetimes from escaping to storage with longer lifetimes. The escape check `EscapeOk(π_e, π_x)` is consumed by the feature-local rules for assignments, closures, and async creation.
