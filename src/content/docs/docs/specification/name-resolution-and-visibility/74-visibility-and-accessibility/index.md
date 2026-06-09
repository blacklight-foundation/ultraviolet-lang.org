---
title: "7.4 Visibility and Accessibility"
description: "7.4 Visibility and Accessibility from 7. Name Resolution and Visibility of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "name-resolution-and-visibility"
specSection: "74-visibility-and-accessibility"
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

## 7.4 Visibility and Accessibility

$$
\begin{array}{l}
\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name})\ =\ \mathsf{it}\ \Leftrightarrow \ \operatorname{ModuleOf}(\mathsf{it})\ =\ \mathsf{mp}\ \land \ \mathsf{it}\ \ne \ \operatorname{ExternBlock}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{IdKey}(\mathsf{name})\ \in \ \operatorname{dom}(\operatorname{ItemBindings}(\mathsf{it},\ \mathsf{mp})) \\[0.16em]
\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name})\ =\ \mathsf{proc}\ \Leftrightarrow \ \operatorname{ExternBlockOf}(\mathsf{proc})\ =\ \mathsf{blk}\ \land \ \operatorname{ModuleOf}(\mathsf{blk})\ =\ \mathsf{mp}\ \land \ \operatorname{ProcName}(\mathsf{proc})\ =\ \mathsf{name}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ModuleOf}(\mathsf{it})\ =\ p\ \Leftrightarrow \ \mathsf{it}\ \in \ \operatorname{ASTModule}(P,\ p).\mathsf{items} \\[0.16em]
\operatorname{ModuleOf}(\mathsf{proc})\ =\ \operatorname{ModuleOf}(\operatorname{ExternBlockOf}(\mathsf{proc})) \\[0.16em]
\operatorname{ExternBlockOf}(\mathsf{proc})\ =\ \mathsf{blk}\ \Leftrightarrow \ \exists \ p.\ \mathsf{blk}\ \in \ \operatorname{ASTModule}(P,\ p).\mathsf{items}\ \land \ \mathsf{proc}\ \in \ \mathsf{blk}.\mathsf{items} \\[0.16em]
\operatorname{ProcName}(\mathsf{proc})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{Vis}(\mathsf{it})\ =\ \mathsf{it}.\mathsf{vis} \\[0.16em]
\operatorname{SameAssembly}(m_{1},\ m_{2})\ \Leftrightarrow \ \operatorname{AsmOfModule}(m_{1})\ =\ \operatorname{AsmOfModule}(m_{2})
\end{array}
$$

**(Access-Public)**

$$
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{public} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Access-Internal)**

$$
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{internal}\quad \operatorname{SameAssembly}(\operatorname{ModuleOf}(\mathsf{it}),\ m) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Access-Private)**

$$
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{private}\quad \operatorname{ModuleOf}(\mathsf{it})\ =\ m \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Access-Internal-Err)**

$$
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{internal}\quad \lnot \ \operatorname{SameAssembly}(\operatorname{ModuleOf}(\mathsf{it}),\ m)\quad c\ =\ \operatorname{Code}(\mathsf{Access}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Uparrow \ c
\end{array}
$$

**(Access-Err)**

$$
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{private}\quad \operatorname{ModuleOf}(\mathsf{it})\ \ne \ m\quad c\ =\ \operatorname{Code}(\mathsf{Access}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{TopLevelDecl}(\mathsf{it})\ \Leftrightarrow \ \mathsf{it}\ \in \ \operatorname{ASTModule}(P,\ \operatorname{ModuleOf}(\mathsf{it})).\mathsf{items}
$$

**(TopLevelVis-Ok)**
TopLevelDecl(it)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TopLevelVis}(\mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
$$
