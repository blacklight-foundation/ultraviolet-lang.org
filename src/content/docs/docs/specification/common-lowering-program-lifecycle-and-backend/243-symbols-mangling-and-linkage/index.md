---
title: "24.3 Symbols, Mangling, and Linkage"
description: "24.3 Symbols, Mangling, and Linkage from 24. Common Lowering, Program Lifecycle, and Backend of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "common-lowering-program-lifecycle-and-backend"
specSection: "243-symbols-mangling-and-linkage"
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

## 24.3 Symbols, Mangling, and Linkage

### 24.3.1 Symbol Names and Mangling

$$
\mathsf{MangleJudg}\ =\ \{\mathsf{Mangle}\}
$$
VTableDecl(T, Cl) constructor
LiteralData(kind, contents) constructor
DefaultImpl(T, m) constructor

$$
\begin{array}{l}
\operatorname{Join}(\mathsf{sep},\ [])\ =\ \texttt{"\textbackslash{}""} \\[0.16em]
\operatorname{Join}(\mathsf{sep},\ [s])\ =\ s \\[0.16em]
\operatorname{Join}(\mathsf{sep},\ [s_{1},\ \ldots ,\ s_{n}])\ =\ s_{1}\ \mathbin{++} \ \mathsf{sep}\ \mathbin{++} \ \operatorname{Join}(\mathsf{sep},\ [s_{2},\ \ldots ,\ s_{n}])\quad (n\ \ge \ 2) \\[0.16em]
\operatorname{PathSig}(p)\ =\ \operatorname{mangle}(\operatorname{PathString}(p)) \\[0.16em]
\operatorname{PathSym}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{PathSig}(\mathsf{path}\ \mathbin{++} \ [\mathsf{name}])
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ItemPath}(\mathsf{it})\ =\ \operatorname{PathOfModule}(\operatorname{ModuleOf}(\mathsf{it}))\ \mathbin{++} \ [\mathsf{name}]\ \Leftrightarrow \ \mathsf{it}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{ItemPath}(\mathsf{it})\ =\ \operatorname{PathOfModule}(\operatorname{ModuleOf}(\mathsf{it}))\ \mathbin{++} \ [\mathsf{name}]\ \Leftrightarrow \ \mathsf{it}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{ItemPath}(m)\ =\ \operatorname{RecordPath}(R)\ \mathbin{++} \ [m.\mathsf{name}]\ \Leftrightarrow \ m\ \in \ \operatorname{Methods}(R) \\[0.16em]
\operatorname{ItemPath}(m)\ =\ \operatorname{ClassPath}(\mathsf{Cl})\ \mathbin{++} \ [m.\mathsf{name}]\ \Leftrightarrow \ m\ \in \ \operatorname{ClassMethods}(\mathsf{Cl}) \\[0.16em]
\operatorname{ItemPath}(m)\ =\ \operatorname{ModalPath}(M)\ \mathbin{++} \ [S]\ \mathbin{++} \ [m.\mathsf{name}]\ \Leftrightarrow \ S\ \in \ \operatorname{States}(M)\ \land \ m\ \in \ \operatorname{Methods}(M,\ S) \\[0.16em]
\operatorname{ItemPath}(\mathsf{tr})\ =\ \operatorname{ModalPath}(M)\ \mathbin{++} \ [S]\ \mathbin{++} \ [\mathsf{tr}.\mathsf{name}]\ \Leftrightarrow \ S\ \in \ \operatorname{States}(M)\ \land \ \mathsf{tr}\ \in \ \operatorname{Transitions}(M,\ S) \\[0.16em]
\operatorname{ItemPath}(\mathsf{it})\ =\ \operatorname{PathOfModule}(\operatorname{ModuleOf}(\mathsf{it}))\ \mathbin{++} \ [\operatorname{StaticName}(\mathsf{binding})]\ \Leftrightarrow \ \mathsf{it}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\ \land \ \operatorname{StaticName}(\mathsf{binding})\ \ne \ \bot  \\[0.16em]
\operatorname{ItemPath}(\operatorname{StaticBinding}(\operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc}),\ x))\ =\ \operatorname{PathOfModule}(\operatorname{ModuleOf}(\operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})))\ \mathbin{++} \ [x] \\[0.16em]
\operatorname{ItemPath}(\operatorname{VTableDecl}(T,\ \mathsf{Cl}))\ =\ [\texttt{"vtable"}]\ \mathbin{++} \ \operatorname{PathOfType}(T)\ \mathbin{++} \ [\texttt{"cl"}]\ \mathbin{++} \ \operatorname{ClassPath}(\mathsf{Cl}) \\[0.16em]
\operatorname{ItemPath}(\operatorname{DefaultImpl}(T,\ m))\ =\ [\texttt{"default"}]\ \mathbin{++} \ \operatorname{PathOfType}(T)\ \mathbin{++} \ [\texttt{"cl"}]\ \mathbin{++} \ \operatorname{ClassPath}(\mathsf{Cl})\ \mathbin{++} \ [m.\mathsf{name}]\ \Leftrightarrow \ m\ \in \ \operatorname{ClassMethods}(\mathsf{Cl})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeStateName}(\texttt{View})\ =\ \texttt{"view"} \\[0.16em]
\operatorname{TypeStateName}(\texttt{Managed})\ =\ \texttt{"managed"} \\[0.16em]
\operatorname{PathOfType}(\operatorname{TypePrim}(\mathsf{name}))\ =\ [\texttt{"prim"},\ \mathsf{name}] \\[0.16em]
\operatorname{PathOfType}(\operatorname{TypeString}(\mathsf{st}))\ =\ [\texttt{"string"},\ \operatorname{TypeStateName}(\mathsf{st})] \\[0.16em]
\operatorname{PathOfType}(\operatorname{TypeBytes}(\mathsf{st}))\ =\ [\texttt{"bytes"},\ \operatorname{TypeStateName}(\mathsf{st})] \\[0.16em]
\operatorname{PathOfType}(\operatorname{TypePath}(p))\ =\ p \\[0.16em]
\operatorname{PathOfType}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{ModalRefPath}(\mathsf{modal}_{\mathsf{ref}})\ \mathbin{++} \ [S] \\[0.16em]
\operatorname{PathOfType}(T)\ =\ \bot \ \Leftrightarrow \ T\ \notin \ \{\operatorname{TypePrim}(\_),\ \operatorname{TypeString}(\_),\ \operatorname{TypeBytes}(\_),\ \operatorname{TypePath}(\_),\ \operatorname{TypeModalState}(\_,\ \_)\} \\[0.16em]
\operatorname{ClassPath}(\mathsf{Cl})\ =\ p\ \Leftrightarrow \ \Sigma .\mathsf{Classes}[p]\ =\ \mathsf{Cl}
\end{array}
$$

FNVOffset64 = 14695981039346656037
FNVPrime64 = 1099511628211

$$
\begin{array}{l}
\operatorname{FNV1a64}([])\ =\ \mathsf{FNVOffset64} \\[0.16em]
\operatorname{FNV1a64}([b_{1},\ \ldots ,\ b_{n}])\ =\ h_{n}\ \Leftrightarrow \ h_{0}\ =\ \mathsf{FNVOffset64}\ \land \ \forall \ i\ \in \ 0..n-1.\ h\_\{i+1\}\ =\ ((h_{i}\ \oplus \ b\_\{i+1\})\ \times \ \mathsf{FNVPrime64})\ \mathsf{mod}\ 2^64 \\[0.16em]
\operatorname{Hex64}(h)\ =\ \operatorname{Join}(\texttt{"\textbackslash{}""},\ [\operatorname{Hex2}(b_{1}),\ \ldots ,\ \operatorname{Hex2}(b_{8})])\ \Leftrightarrow \ \operatorname{rev}(\operatorname{LEBytes}(h,\ 8))\ =\ [b_{1},\ \ldots ,\ b_{8}] \\[0.16em]
\operatorname{LiteralID}(\mathsf{kind},\ \mathsf{contents})\ =\ \operatorname{mangle}(\mathsf{kind})\ \mathbin{++} \ \texttt{"\_"}\ \mathbin{++} \ \operatorname{Hex64}(\operatorname{FNV1a64}(\mathsf{contents})) \\[0.16em]
\operatorname{LiteralDataSym}(\mathsf{kind},\ \mathsf{bytes})\ =\ \operatorname{Mangle}(\operatorname{LiteralData}(\mathsf{kind},\ \mathsf{bytes}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ScopedSym}(\mathsf{item})\ =\ \operatorname{PathSig}(\operatorname{ItemPath}(\mathsf{item})) \\[0.16em]
\operatorname{RawSym}(s)\ =\ s \\[0.16em]
\operatorname{HostBodySym}(\mathsf{item})\ =\ \operatorname{PathSig}([\operatorname{ScopedSym}(\mathsf{item}),\ \texttt{"\_\_host\_body"}])\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{HostExportAttr}(\mathsf{item})\ \mathsf{defined}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AttrListOf}(\mathsf{item})\ =\ \mathsf{attrs}\quad \mathsf{if}\ \mathsf{item}.\mathsf{attrs}_{\mathsf{opt}}\ =\ \mathsf{attrs} \\[0.16em]
\operatorname{AttrListOf}(\mathsf{item})\ =\ []\quad \mathsf{if}\ \mathsf{item}.\mathsf{attrs}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\operatorname{AttrByName}(\mathsf{item},\ n)\ =\ [a\ \mid \ a\ \in \ \operatorname{AttrListOf}(\mathsf{item})\ \land \ a.\mathsf{name}\ =\ n] \\[0.16em]
\operatorname{MangleAttr}(\mathsf{item})\ =\ \mathsf{mode}\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AttrByName}(\mathsf{item},\ \texttt{"mangle"}).\ \operatorname{MangleArgs}(a)\ =\ \mathsf{mode} \\[0.16em]
\operatorname{MangleArgs}(a)\ =\ \texttt{none}\ \Leftrightarrow \ a.\mathsf{args}\ =\ [\operatorname{Identifier}(\texttt{none})] \\[0.16em]
\operatorname{MangleArgs}(a)\ =\ s\quad \Leftrightarrow \ a.\mathsf{args}\ =\ [\operatorname{StringLiteral}(s)] \\[0.16em]
\operatorname{ExportAttr}(\mathsf{item})\ =\ \mathsf{abi}\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AttrByName}(\mathsf{item},\ \texttt{"export"}).\ a.\mathsf{args}\ =\ [\operatorname{StringLiteral}(\mathsf{abi})] \\[0.16em]
\operatorname{HostExportAttr}(\mathsf{item})\ =\ \mathsf{abi}\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AttrByName}(\mathsf{item},\ \texttt{"host\_export"}).\ a.\mathsf{args}\ =\ [\operatorname{StringLiteral}(\mathsf{abi})]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StringText}(\mathsf{tok})\ =\ s\ \Leftrightarrow \ \mathsf{tok}.\mathsf{kind}\ =\ \mathsf{StringLiteral}\ \land \ T\ =\ \operatorname{Lexeme}(\mathsf{tok})\ \land \ \operatorname{StringBytesFrom}(T,\ 1,\ \mid T\mid -1)\ =\ \mathsf{bytes}\ \land \ \operatorname{DecodeUTF8}(\mathsf{bytes})\ =\ s \\[0.16em]
\operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}})\ =\ \texttt{"C"}\quad \mathsf{if}\ \mathsf{abi}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}})\ =\ s\quad \mathsf{if}\ \mathsf{abi}_{\mathsf{opt}}\ =\ \operatorname{IdentAbi}(s) \\[0.16em]
\operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}})\ =\ s\quad \mathsf{if}\ \mathsf{abi}_{\mathsf{opt}}\ =\ \operatorname{StringAbi}(\mathsf{tok})\ \land \ \operatorname{StringText}(\mathsf{tok})\ =\ s \\[0.16em]
\operatorname{ExternAbiExplicit}(\mathsf{abi}_{\mathsf{opt}})\ \Leftrightarrow \ \mathsf{abi}_{\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\operatorname{ExternAbiOf}(\mathsf{proc})\ =\ \mathsf{abi}_{\mathsf{opt}}\ \Leftrightarrow \ \operatorname{ExternBlockOf}(\mathsf{proc})\ =\ \operatorname{ExternBlock}(\_,\ \_,\ \mathsf{abi}_{\mathsf{opt}},\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{ExternRawName}(\mathsf{proc})\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{ExternAbiName}(\operatorname{ExternAbiOf}(\mathsf{proc}))\ \in \ \{\texttt{"C"},\ \texttt{"C-unwind"}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym}\ \Leftrightarrow  \\[0.16em]
\ \operatorname{MangleAttr}(\mathsf{item})\ =\ \texttt{none}\quad \land \ \mathsf{sym}\ =\ \operatorname{RawSym}(\operatorname{ItemName}(\mathsf{item})) \\[0.16em]
\ \operatorname{MangleAttr}(\mathsf{item})\ =\ s\ \land \ s\ \ne \ \texttt{none}\quad \land \ \mathsf{sym}\ =\ \operatorname{RawSym}(s) \\[0.16em]
\ \operatorname{MangleAttr}(\mathsf{item})\ \mathsf{undefined}\ \land \ \operatorname{ExternRawName}(\mathsf{item})\quad \land \ \mathsf{sym}\ =\ \operatorname{RawSym}(\operatorname{ItemName}(\mathsf{item})) \\[0.16em]
\ \operatorname{MangleAttr}(\mathsf{item})\ \mathsf{undefined}\ \land \ \operatorname{ExportAttr}(\mathsf{item})\ \mathsf{defined}\quad \land \ \mathsf{sym}\ =\ \operatorname{ScopedSym}(\mathsf{item}) \\[0.16em]
\ \operatorname{MangleAttr}(\mathsf{item})\ \mathsf{undefined}\ \land \ \operatorname{ExportAttr}(\mathsf{item})\ \mathsf{undefined}\ \land \ \mathsf{sym}\ =\ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

$$
\operatorname{HostThunkLinkName}(\mathsf{item})\ =\ \mathsf{sym}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{HostExportAttr}(\mathsf{item})\ \mathsf{defined}\ \land \ \operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym}
$$

$$
\begin{array}{l}
\operatorname{ItemName}(\mathsf{item})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{ItemName}(\mathsf{item})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{ItemName}(\mathsf{item})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \langle \operatorname{IdentifierPattern}(\mathsf{name}),\ \_,\ \_,\ \_,\ \_\rangle ,\ \_,\ \_)
\end{array}
$$

**(Mangle-HostExport-Proc)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{name}\ \ne \ \texttt{"main"}\quad \operatorname{HostExportAttr}(\mathsf{item})\ \mathsf{defined}\quad \operatorname{HostBodySym}(\mathsf{item})\ =\ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(Mangle-Proc)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{name}\ \ne \ \texttt{"main"}\quad \operatorname{HostExportAttr}(\mathsf{item})\ \mathsf{undefined}\quad \operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(Mangle-ExternProc)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ExternProcDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{foreign}_{\mathsf{contracts}\_\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(Mangle-Main)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \texttt{"main"},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{MainSigOk}(\mathsf{item})\quad \operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(Mangle-Record-Method)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{MethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-Class-Method)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-State-Method)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StateMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-Transition)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{TransitionDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-Static)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{StaticName}(\mathsf{binding})\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-StaticBinding)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-VTable)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{VTableDecl}(T,\ \mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-Literal)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{LiteralData}(\mathsf{kind},\ \mathsf{contents})\quad \operatorname{LiteralID}(\mathsf{kind},\ \mathsf{contents})\ =\ \mathsf{id} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"literal"},\ \mathsf{id}])
\end{array}
$$

**(Mangle-DefaultImpl)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{DefaultImpl}(T,\ m) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

ClosureIndex(C) returns a unique index for closure C within its enclosing scope.

$$
\operatorname{EnclosingSym}(C)\ =\ \mathsf{sym}\ \Leftrightarrow \ \operatorname{EnclosingScope}(C)\ =\ \mathsf{item}\ \land \ \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
$$

**(Mangle-Closure)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{EnclosingSym}(C)\ =\ \mathsf{sym}_{\mathsf{enc}}\quad \operatorname{ClosureIndex}(C)\ =\ \mathsf{idx} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \operatorname{PathSig}([\mathsf{sym}_{\mathsf{enc}},\ \texttt{"\_closure"}\ \mathbin{++} \ \operatorname{ToString}(\mathsf{idx})])
\end{array}
$$

**(Mangle-ClosureEnv)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \mathsf{sym}_{\mathsf{closure}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MangleClosureEnv}(C)\ \Downarrow \ \operatorname{PathSig}([\mathsf{sym}_{\mathsf{closure}},\ \texttt{"\_env"}])
\end{array}
$$

$$
\operatorname{ClosureCodeSym}(C)\ =\ \mathsf{sym}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \mathsf{sym}
$$

### 24.3.2 Linkage for Generated Symbols

$$
\begin{array}{l}
\mathsf{LinkageKind}\ =\ \{\texttt{internal},\ \texttt{external}\} \\[0.16em]
\mathsf{LinkageJudg}\ =\ \{\mathsf{Linkage}\}
\end{array}
$$

**(Linkage-UserItem)**

$$
\begin{array}{l}
\mathsf{item}\ \in \ \{\mathsf{ProcedureDecl},\ \mathsf{StaticDecl},\ \mathsf{MethodDecl}\}\quad \operatorname{Vis}(\mathsf{item})\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-ExternProc)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-UserItem-Internal)**

$$
\begin{array}{l}
\mathsf{item}\ \in \ \{\mathsf{ProcedureDecl},\ \mathsf{StaticDecl},\ \mathsf{MethodDecl}\}\quad \operatorname{Vis}(\mathsf{item})\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-StaticBinding)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \mathsf{vis},\ \_,\ \_,\ \_,\ \_),\ x)\quad \mathsf{vis}\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-StaticBinding-Internal)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \mathsf{vis},\ \_,\ \_,\ \_,\ \_),\ x)\quad \mathsf{vis}\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-ClassMethod)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \mathsf{body}_{\mathsf{opt}}\ \ne \ \bot \quad \operatorname{Vis}(\mathsf{item})\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-ClassMethod-Internal)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \mathsf{body}_{\mathsf{opt}}\ \ne \ \bot \quad \operatorname{Vis}(\mathsf{item})\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-StateMethod)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StateMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \operatorname{Vis}(\mathsf{item})\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-StateMethod-Internal)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StateMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \operatorname{Vis}(\mathsf{item})\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-Transition)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{TransitionDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \operatorname{Vis}(\mathsf{item})\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-Transition-Internal)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{TransitionDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \operatorname{Vis}(\mathsf{item})\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-InitFn)**

$$
\begin{array}{l}
\operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-DeinitFn)**

$$
\begin{array}{l}
\operatorname{DeinitFn}(m)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-VTable)**

$$
\begin{array}{l}
\operatorname{Mangle}(\operatorname{VTableDecl}(T,\ \mathsf{Cl}))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-LiteralData)**

$$
\begin{array}{l}
\operatorname{Mangle}(\operatorname{LiteralData}(\mathsf{kind},\ \mathsf{contents}))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-DropGlue)**

$$
\begin{array}{l}
\operatorname{DropGlueSym}(T)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-DefaultImpl)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{DefaultImpl}(T,\ m)\quad \operatorname{Vis}(m)\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-DefaultImpl-Internal)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{DefaultImpl}(T,\ m)\quad \operatorname{Vis}(m)\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-PanicSym)**

$$
\begin{array}{l}
\mathsf{PanicSym}\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-BuiltinModalSym)**

$$
\begin{array}{l}
\operatorname{BuiltinModalSym}(\mathsf{proc})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-BuiltinSym)**

$$
\begin{array}{l}
\operatorname{BuiltinSym}(\mathsf{method})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-EntrySym)**

$$
\begin{array}{l}
\mathsf{EntrySym}\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$
