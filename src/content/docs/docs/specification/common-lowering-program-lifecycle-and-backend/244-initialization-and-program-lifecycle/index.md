---
title: "24.4 Initialization and Program Lifecycle"
description: "24.4 Initialization and Program Lifecycle from 24. Common Lowering, Program Lifecycle, and Backend of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "common-lowering-program-lifecycle-and-backend"
specSection: "244-initialization-and-program-lifecycle"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/">24. Common Lowering, Program Lifecycle, and Backend</a>
  <span>Common Lowering, Program Lifecycle, and Backend</span>
</div>

## 24.4 Initialization and Program Lifecycle

### 24.4.1 Static Globals and Module Init/Deinit Lowering

$$
\mathsf{GlobalsJudg}\ =\ \{\mathsf{EmitGlobal},\ \mathsf{InitFn},\ \mathsf{DeinitFn},\ \mathsf{Lower}-\mathsf{StaticInit},\ \mathsf{Lower}-\mathsf{StaticInitItem},\ \mathsf{Lower}-\mathsf{StaticInitItems},\ \mathsf{InitCallIR},\ \mathsf{Lower}-\mathsf{StaticDeinit},\ \mathsf{Lower}-\mathsf{StaticDeinitNames},\ \mathsf{Lower}-\mathsf{StaticDeinitItem},\ \mathsf{Lower}-\mathsf{StaticDeinitItems},\ \mathsf{DeinitCallIR},\ \mathsf{EmitInitPlan},\ \mathsf{EmitDeinitPlan},\ \mathsf{EmitStringLit},\ \mathsf{EmitBytesLit},\ \mathsf{InitPanicHandle}\}
$$

$$
\mathsf{ConstInitJudg}\ =\ \{\mathsf{ConstInit}\}
$$

$$
\Gamma \ \vdash \ \operatorname{ConstInit}(e)\ \Downarrow \ \mathsf{bytes}\ \Leftrightarrow \ e\ =\ \operatorname{Literal}(\mathsf{lit})\ \land \ \Gamma \ \vdash \ \operatorname{EncodeConst}(\operatorname{ExprType}(e),\ \mathsf{lit})\ \Downarrow \ \mathsf{bytes}
$$

$$
\begin{array}{l}
\operatorname{StaticName}(\mathsf{binding})\ = \\[0.16em]
\ \mathsf{name}\quad \mathsf{if}\ \mathsf{binding}\ =\ \langle \operatorname{IdentifierPattern}(\mathsf{name}),\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{span}\rangle  \\[0.16em]
\ \bot \quad \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{StaticBindTypes}(\mathsf{binding})\ =\ B\ \Leftrightarrow \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \ \land \ \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ \operatorname{BindType}(\mathsf{binding})\ \dashv \ B
$$

$$
\operatorname{StaticBindList}(\mathsf{binding})\ =\ \operatorname{PatNames}(\mathsf{pat})\ \Leftrightarrow \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle 
$$

$$
\mathsf{StaticBinding}\ :\ \mathsf{StaticDecl}\ \times \ \mathsf{Name}\ \to \ \mathsf{StaticDecl}
$$

$$
\begin{array}{l}
\operatorname{StaticSym}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x)\ = \\[0.16em]
\ \operatorname{Mangle}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_))\quad \mathsf{if}\ \operatorname{StaticName}(\mathsf{binding})\ =\ x \\[0.16em]
\ \operatorname{Mangle}(\operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x))\quad \mathsf{otherwise}
\end{array}
$$

**(Emit-Static-Const)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{mut}\ =\ \texttt{let}\quad \operatorname{StaticName}(\mathsf{binding})\ =\ \mathsf{name}\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ConstInit}(\mathsf{init})\ \Downarrow \ \mathsf{bytes}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitGlobal}(\mathsf{item})\ \Downarrow \ [\operatorname{GlobalConst}(\mathsf{sym},\ \mathsf{bytes})]
\end{array}
$$

**(Emit-Static-Init)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{StaticName}(\mathsf{binding})\ =\ \mathsf{name}\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad ((\mathsf{mut}\ =\ \texttt{var})\ \lor \ (\Gamma \ \vdash \ \operatorname{ConstInit}(\mathsf{init})\ \Uparrow ))\quad T\ =\ \operatorname{ExprType}(\mathsf{init})\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitGlobal}(\mathsf{item})\ \Downarrow \ [\operatorname{GlobalZero}(\mathsf{sym},\ \operatorname{sizeof}(T))]
\end{array}
$$

**(Emit-Static-Multi)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{StaticName}(\mathsf{binding})\ =\ \bot \quad \operatorname{StaticBindTypes}(\mathsf{binding})\ =\ B\quad \operatorname{StaticBindList}(\mathsf{binding})\ =\ [x_{1},\ \ldots ,\ x_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{StaticBinding}(\mathsf{item},\ x_{i}))\ \Downarrow \ \mathsf{sym}_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitGlobal}(\mathsf{item})\ \Downarrow \ [\operatorname{GlobalZero}(\mathsf{sym}_{1},\ \operatorname{sizeof}(B[x_{1}])),\ \ldots ,\ \operatorname{GlobalZero}(\mathsf{sym}_{k},\ \operatorname{sizeof}(B[x_{k}]))]
\end{array}
$$

$$
\operatorname{InitSym}(m)\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"init"}]\ \mathbin{++} \ \operatorname{PathOfModule}(m))
$$

**(InitFn)**

$$
\begin{array}{l}
\operatorname{InitSym}(m)\ =\ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym}
\end{array}
$$

$$
\operatorname{DeinitSym}(m)\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"deinit"}]\ \mathbin{++} \ \operatorname{PathOfModule}(m))
$$

**(DeinitFn)**

$$
\begin{array}{l}
\operatorname{DeinitSym}(m)\ =\ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DeinitFn}(m)\ \Downarrow \ \mathsf{sym}
\end{array}
$$

$$
\operatorname{StaticItems}(P,\ m)\ =\ [\ \mathsf{item}\ \mid \ \mathsf{item}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)\ ]
$$

$$
\operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{item}\ \Leftrightarrow \ m\ =\ \mathsf{path}\ \land \ \mathsf{item}\ \in \ \operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ \land \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_)\ \land \ \mathsf{name}\ \in \ \operatorname{StaticBindList}(\mathsf{binding})\ \land \ \forall \ \mathsf{item}'.\ (\mathsf{item}'\ \in \ \operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ \land \ \mathsf{item}'\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding}',\ \_,\ \_)\ \land \ \mathsf{name}\ \in \ \operatorname{StaticBindList}(\mathsf{binding}'))\ \Rightarrow \ \mathsf{item}'\ =\ \mathsf{item}
$$

$$
\operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticSym}(\mathsf{item},\ \mathsf{name})\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{item}
$$

$$
\operatorname{StaticAddr}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{addr}\ \Leftrightarrow \ \exists \ \mathsf{sym}.\ \operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\ \land \ \operatorname{AddrOfSym}(\mathsf{sym})\ =\ \mathsf{addr}
$$

For hosted-library session execution, §24.4.1 reinterprets the `AddrOfSym(sym)` occurrence above session-locally for every hosted-state symbol.

$$
\mathsf{AddrOfSym}\ :\ \mathsf{Symbol}\ \to \ \mathsf{Addr}
$$

$$
\operatorname{StaticType}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticBindTypes}(\mathsf{binding})[\mathsf{name}]\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \mathsf{mut},\ \mathsf{binding},\ \_,\ \_)
$$

$$
\operatorname{StaticBindInfo}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{BindInfoMap}(\lambda \ U.\ \operatorname{RespOfInit}(\mathsf{init}),\ \operatorname{StaticBindTypes}(\mathsf{binding}),\ \operatorname{MovOf}(\mathsf{op}),\ \mathsf{mut})[\mathsf{name}]\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \mathsf{mut},\ \mathsf{binding},\ \_,\ \_)\ \land \ \mathsf{binding}\ =\ \langle \_,\ \_,\ \mathsf{op},\ \mathsf{init},\ \_\rangle 
$$

$$
\begin{array}{l}
\operatorname{SeqIRList}([])\ =\ \varepsilon  \\[0.16em]
\operatorname{SeqIRList}([\mathsf{IR}]\ \mathbin{++} \ \mathsf{IRs})\ =\ \operatorname{SeqIR}(\mathsf{IR},\ \operatorname{SeqIRList}(\mathsf{IRs}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StaticStoreIR}(\mathsf{item},\ [])\ =\ \varepsilon  \\[0.16em]
\operatorname{StaticStoreIR}(\mathsf{item},\ [\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{bs})\ =\ \operatorname{SeqIR}(\operatorname{StoreGlobal}(\operatorname{StaticSym}(\mathsf{item},\ x),\ v),\ \operatorname{StaticStoreIR}(\mathsf{item},\ \mathsf{bs}))
\end{array}
$$

**(Lower-StaticInit-Item)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{init})\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\quad \operatorname{BindOrder}(\mathsf{pat},\ B)\ =\ \mathsf{binds}\quad \Gamma \ \vdash \ \operatorname{InitPanicHandle}(m)\ \Downarrow \ \mathsf{IR}_{p} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItem}(m,\ \mathsf{item})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{StaticStoreIR}(\mathsf{item},\ \mathsf{binds}),\ \mathsf{IR}_{p})
\end{array}
$$

**(Lower-StaticInitItems-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ [])\ \Downarrow \ \varepsilon 
\end{array}
$$

**(Lower-StaticInitItems-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItem}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{IR}_{i}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ \mathsf{items})\ \Downarrow \ \mathsf{IR}_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ [\mathsf{item}]\ \mathbin{++} \ \mathsf{items})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{i},\ \mathsf{IR}_{r})
\end{array}
$$

**(Lower-StaticInit)**

$$
\begin{array}{l}
\operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ =\ \mathsf{items}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ \mathsf{items})\ \Downarrow \ \mathsf{IR} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInit}(m)\ \Downarrow \ \mathsf{IR}
\end{array}
$$

**(InitCallIR)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InitCallIR}(m)\ \Downarrow \ \operatorname{SeqIR}(\operatorname{CallIR}(\mathsf{sym},\ [\mathsf{PanicOutName}]),\ \mathsf{PanicCheck})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Rev}([])\ =\ [] \\[0.16em]
\operatorname{Rev}([x]\ \mathbin{++} \ \mathsf{xs})\ =\ \operatorname{Rev}(\mathsf{xs})\ \mathbin{++} \ [x]
\end{array}
$$

**(Lower-StaticDeinitNames-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ [])\ \Downarrow \ \varepsilon 
\end{array}
$$

**(Lower-StaticDeinitNames-Cons-Resp)**

$$
\begin{array}{l}
\operatorname{StaticBindInfo}(\mathsf{path},\ x).\mathsf{resp}\ =\ \mathsf{resp}\quad \mathsf{sym}\ =\ \operatorname{StaticSym}(\mathsf{item},\ x)\quad \Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot}\quad \Gamma \ \vdash \ \operatorname{EmitDrop}(\operatorname{StaticType}(\mathsf{path},\ x),\ \operatorname{Load}(\mathsf{slot},\ \operatorname{StaticType}(\mathsf{path},\ x)))\ \Downarrow \ \mathsf{IR}_{d}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ \mathsf{xs})\ \Downarrow \ \mathsf{IR}_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ [x]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{d},\ \mathsf{IR}_{r})
\end{array}
$$

**(Lower-StaticDeinitNames-Cons-NoResp)**

$$
\begin{array}{l}
\operatorname{StaticBindInfo}(\mathsf{path},\ x).\mathsf{resp}\ \ne \ \mathsf{resp}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ \mathsf{xs})\ \Downarrow \ \mathsf{IR}_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ [x]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ \mathsf{IR}_{r}
\end{array}
$$

**(Lower-StaticDeinit-Item)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle \quad \mathsf{xs}\ =\ \operatorname{Rev}(\operatorname{StaticBindList}(\mathsf{binding}))\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\operatorname{PathOfModule}(m),\ \mathsf{item},\ \mathsf{xs})\ \Downarrow \ \mathsf{IR} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItem}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{IR}
\end{array}
$$

**(Lower-StaticDeinitItems-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ [])\ \Downarrow \ \varepsilon 
\end{array}
$$

**(Lower-StaticDeinitItems-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItem}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{IR}_{i}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ \mathsf{items})\ \Downarrow \ \mathsf{IR}_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ [\mathsf{item}]\ \mathbin{++} \ \mathsf{items})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{i},\ \mathsf{IR}_{r})
\end{array}
$$

**(Lower-StaticDeinit)**

$$
\begin{array}{l}
\operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ =\ \mathsf{items}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ \operatorname{Rev}(\mathsf{items}))\ \Downarrow \ \mathsf{IR} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinit}(m)\ \Downarrow \ \mathsf{IR}
\end{array}
$$

**(DeinitCallIR)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DeinitFn}(m)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DeinitCallIR}(m)\ \Downarrow \ \operatorname{SeqIR}(\operatorname{CallIR}(\mathsf{sym},\ [\mathsf{PanicOutName}]),\ \mathsf{PanicCheck})
\end{array}
$$

$$
\begin{array}{l}
\mathsf{AddrOfSessionSym}\ :\ \mathsf{Session}\ \times \ \mathsf{Symbol}\ \to \ \mathsf{Addr} \\[0.16em]
\mathsf{SessionPanicRecordOf}\ :\ \mathsf{Store}\ \times \ \mathsf{Session}\ \to \ \langle \mathsf{pending},\ \mathsf{code}\rangle  \\[0.16em]
\operatorname{SessionPanicRecordInit}(\sigma ,\ h)\ \Leftrightarrow \ \operatorname{SessionPanicRecordOf}(\sigma ,\ h)\ =\ \langle \mathsf{false},\ 0\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{HostedStateSym}(P,\ \mathsf{sym})\ \Leftrightarrow \ \operatorname{HostedLibrary}(P)\ \land \ ((\exists \ m,\ \mathsf{name}.\ m\ \in \ P.\mathsf{modules}\ \land \ \operatorname{StaticSymPath}(m,\ \mathsf{name})\ =\ \mathsf{sym})\ \lor \ (\exists \ m.\ m\ \in \ P.\mathsf{modules}\ \land \ \Gamma \ \vdash \ \operatorname{PoisonFlag}(m)\ \Downarrow \ \mathsf{sym})) \\[0.16em]
\operatorname{SharedLibraryStateSym}(P,\ \mathsf{sym})\ \Leftrightarrow \ \operatorname{SharedLibrary}(P)\ \land \ ((\exists \ m,\ \mathsf{name}.\ m\ \in \ P.\mathsf{modules}\ \land \ \operatorname{StaticSymPath}(m,\ \mathsf{name})\ =\ \mathsf{sym})\ \lor \ (\exists \ m.\ m\ \in \ P.\mathsf{modules}\ \land \ \Gamma \ \vdash \ \operatorname{PoisonFlag}(m)\ \Downarrow \ \mathsf{sym})) \\[0.16em]
\operatorname{RawExportLibrary}(P)\ \Leftrightarrow \ \operatorname{SharedLibrary}(P)\ \land \ \operatorname{RawExports}(P)\ \ne \ []\ \land \ \lnot \ \operatorname{HostedLibrary}(P) \\[0.16em]
\operatorname{RawLibraryStateSym}(P,\ \mathsf{sym})\ \Leftrightarrow \ \operatorname{RawExportLibrary}(P)\ \land \ \operatorname{SharedLibraryStateSym}(P,\ \mathsf{sym}) \\[0.16em]
\mathsf{HostedStateJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{SessionStateInitSigma}(P,\ h,\ \sigma )\ \Downarrow \ \sigma ',\ \Gamma \ \vdash \ \operatorname{SessionStateDestroySigma}(P,\ h,\ \sigma )\ \Downarrow \ \sigma '\}
\end{array}
$$

A conforming implementation MUST ensure that whenever `Γ ⊢ SessionStateInitSigma(P, h, σ) ⇓ σ'`, `ReadAddr(σ', AddrOfSessionSym(h, sym))` is defined for every `sym` satisfying `HostedStateSym(P, sym)`, and the initial contents of that cell equal the value denoted by the `GlobalConst` or `GlobalZero` template emitted for `sym` by §§24.4.1, 24.7.8, and 24.7.13.

A conforming implementation MUST ensure that whenever `Γ ⊢ SessionStateDestroySigma(P, h, σ) ⇓ σ'`, the cells previously reachable at `AddrOfSessionSym(h, sym)` for `HostedStateSym(P, sym)` are no longer live.

For `HostedLibrary(P)` as defined by §23.3.10, every user-static storage cell, poison flag, and boundary panic record consumed by Chapters 6, 24.4, and 24.5 MUST be indexed by the live hosted session within the dynamic extent of `HostSessionInitSigma`, `HostedCallSigma`, and `HostSessionDestroySigma`. Within those hosted-session dynamic extents, every occurrence of `AddrOfSym(sym)` in those rules with `HostedStateSym(P, sym)` MUST be interpreted as `AddrOfSessionSym(h, sym)` for the active hosted session `h`, and every boundary panic-record operation MUST be interpreted through `SessionPanicRecordOf(_, h)`. For `HostedLibrary(P) ∧ SharedLibrary(P)`, when execution occurs outside those hosted-session dynamic extents but within one live loaded library image `i`, every occurrence of `AddrOfSym(sym)` in Chapters 6, 24.4, and 24.5 with `HostedStateSym(P, sym)` MUST instead be interpreted as `AddrOfImageSym(i, sym)`, and every boundary panic-record operation MUST be interpreted through `ImagePanicRecordOf(_, i)`. Executables and libraries that are not shared libraries continue to use the process-global interpretation of `AddrOfSym(sym)` and `PanicRecordOf(_)` outside hosted-session dynamic extents.

### 24.4.2 Initialization Order, Poisoning, and Project Lifecycle

Section §11.5.4 supplies the eager static-initialization dependency graph `G_e`. This section defines only the ordering and execution semantics that consume that graph.

$$
\begin{array}{l}
\operatorname{Vertices}(G_{e})\ =\ V\ \Leftrightarrow \ G_{e}\ =\ \langle V,\ E\rangle  \\[0.16em]
\operatorname{Edges}(G_{e})\ =\ E\ \Leftrightarrow \ G_{e}\ =\ \langle V,\ E\rangle  \\[0.16em]
\operatorname{Index}(L,\ x)\ =\ i\ \Leftrightarrow \ 0\ \le \ i\ <\ \mid L\mid \ \land \ L[i]\ =\ x \\[0.16em]
\operatorname{TopoOrder}(G_{e},\ L)\ \Leftrightarrow \ \operatorname{Distinct}(L)\ \land \ \operatorname{Set}(L)\ =\ \operatorname{Vertices}(G_{e})\ \land \ \forall \ (u,\ v)\ \in \ \operatorname{Edges}(G_{e}).\ \operatorname{Index}(L,\ u)\ <\ \operatorname{Index}(L,\ v) \\[0.16em]
\mathsf{Incomparable}\_\{G_{e}\}(u,\ v)\ \Leftrightarrow \ \lnot \ \operatorname{Reachable}(u,\ v,\ \operatorname{Edges}(G_{e}))\ \land \ \lnot \ \operatorname{Reachable}(v,\ u,\ \operatorname{Edges}(G_{e})) \\[0.16em]
\operatorname{TopoTieBreak}(G_{e},\ L,\ P)\ \Leftrightarrow \ \forall \ u,\ v\ \in \ \operatorname{Vertices}(G_{e}).\ \mathsf{Incomparable}\_\{G_{e}\}(u,\ v)\ \land \ \operatorname{Index}(P.\mathsf{modules},\ u)\ <\ \operatorname{Index}(P.\mathsf{modules},\ v)\ \Rightarrow \ \operatorname{Index}(L,\ u)\ <\ \operatorname{Index}(L,\ v) \\[0.16em]
\operatorname{Cycle}(G_{e})\ \Leftrightarrow \ \exists \ v\ \in \ \operatorname{Vertices}(G_{e}).\ \operatorname{Reachable}(v,\ v,\ \operatorname{Edges}(G_{e}))
\end{array}
$$

**(Topo-Ok)**

$$
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad \Gamma \ \vdash \ G_{e}\ :\ \mathsf{DAG}\quad \operatorname{TopoOrder}(G_{e},\ L)\quad \operatorname{TopoTieBreak}(G_{e},\ L,\ P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Topo}(G_{e})\ \Downarrow \ L
\end{array}
$$

**(Topo-Cycle)**

$$
\begin{array}{l}
\operatorname{Cycle}(G_{e})\quad c\ =\ \operatorname{Code}(\mathsf{Topo}-\mathsf{Cycle}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Topo}(G_{e})\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
P\ =\ \operatorname{Project}(\Gamma ) \\[0.16em]
\operatorname{StaticInitOf}(\mathsf{item})\ =\ \mathsf{init}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\ \land \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{sp}\rangle  \\[0.16em]
\operatorname{StaticInitOf}(\mathsf{item})\ =\ \bot \ \Leftrightarrow \ \mathsf{item}\ \notin \ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{InitList}(m)\ =\ [\ \mathsf{init}\ \mid \ \mathsf{item}\ \in \ \operatorname{Items}(P,\ m)\ \land \ \operatorname{StaticInitOf}(\mathsf{item})\ =\ \mathsf{init}\ ]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{InitOrder}(G_{e})\ =\ L\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Topo}(G_{e})\ \Downarrow \ L \\[0.16em]
\operatorname{InitPlan}(G_{e})\ =\ \mathbin{++} \_\{m\ \in \ \operatorname{InitOrder}(G_{e})\}\ \operatorname{InitList}(m)
\end{array}
$$

$$
\operatorname{DeinitOrder}(G_{e})\ =\ \operatorname{rev}(\operatorname{InitOrder}(G_{e}))
$$

$$
\operatorname{StaticBindOrder}(m)\ =\ \mathbin{++} \_\{\mathsf{item}\ \in \ \operatorname{StaticItems}(P,\ m),\ \mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\}\ [\langle \operatorname{PathOfModule}(m),\ x\rangle \ \mid \ x\ \in \ \operatorname{StaticBindList}(\mathsf{binding})]
$$

$$
\mathsf{GlobalStaticOrder}\ =\ \mathbin{++} \_\{m\ \in \ \operatorname{InitOrder}(G_{e})\}\ \operatorname{StaticBindOrder}(m)
$$

$$
\operatorname{DeinitList}(P)\ =\ \operatorname{rev}([\ \operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})\ \mid \ \langle \mathsf{path},\ \mathsf{name}\rangle \ \in \ \mathsf{GlobalStaticOrder}\ \land \ \operatorname{StaticBindInfo}(\mathsf{path},\ \mathsf{name}).\mathsf{resp}\ =\ \mathsf{resp}\ ])
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Eval}(e,\ \sigma )\ \Downarrow \ v\ \Leftrightarrow \ \exists \ \sigma '.\ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma ') \\[0.16em]
\Gamma \ \vdash \ \operatorname{Eval}(e,\ \sigma )\ \Uparrow \ \mathsf{panic}\ \Leftrightarrow \ \exists \ \sigma '.\ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')
\end{array}
$$

**(EmitInitPlan)**

$$
\begin{array}{l}
\mathsf{InitOrder}\ =\ [m_{1},\ \ldots ,\ m_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{InitCallIR}(m_{i})\ \Downarrow \ \mathsf{IR}_{i}\quad \mathsf{IR}_{\mathsf{init}}\ =\ \operatorname{SeqIRList}([\mathsf{IR}_{1},\ \ldots ,\ \mathsf{IR}_{k}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitInitPlan}(P)\ \Downarrow \ \mathsf{IR}_{\mathsf{init}}
\end{array}
$$

**(EmitInitPlan-Err)**

$$
\begin{array}{l}
\exists \ m\ \in \ \mathsf{InitOrder}.\ \Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitInitPlan}(P)\ \Uparrow 
\end{array}
$$

**(EmitDeinitPlan)**

$$
\begin{array}{l}
\mathsf{InitOrder}\ =\ [m_{1},\ \ldots ,\ m_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{DeinitCallIR}(m_{i})\ \Downarrow \ \mathsf{IR}_{i}\quad \mathsf{IR}_{\mathsf{deinit}}\ =\ \operatorname{SeqIRList}(\operatorname{Rev}([\mathsf{IR}_{1},\ \ldots ,\ \mathsf{IR}_{k}])) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitDeinitPlan}(P)\ \Downarrow \ \mathsf{IR}_{\mathsf{deinit}}
\end{array}
$$

**(EmitDeinitPlan-Err)**

$$
\begin{array}{l}
\exists \ m\ \in \ \mathsf{InitOrder}.\ \Gamma \ \vdash \ \operatorname{DeinitFn}(m)\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitDeinitPlan}(P)\ \Uparrow 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{InitState}\ =\ \{\operatorname{InitStart}(G_{e},\ L,\ \sigma ),\ \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma ),\ \operatorname{InitDone}(\sigma ),\ \operatorname{InitPanic}(P,\ \sigma )\} \\[0.16em]
\operatorname{InitItem}(L,\ \mathsf{mi},\ \mathsf{ii})\ =\ e\ \Leftrightarrow \ \mathsf{mi}\ <\ \mid L\mid \ \land \ L[\mathsf{mi}]\ =\ m\ \land \ \operatorname{InitList}(m)[\mathsf{ii}]\ =\ e \\[0.16em]
\operatorname{InitLen}(L,\ \mathsf{mi})\ =\ k\ \Leftrightarrow \ \mathsf{mi}\ <\ \mid L\mid \ \land \ L[\mathsf{mi}]\ =\ m\ \land \ \mid \operatorname{InitList}(m)\mid \ =\ k
\end{array}
$$

**(Init-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{InitStart}(G_{e},\ L,\ \sigma )\rangle \ \to \ \langle \operatorname{InitMod}(L,\ 0,\ 0,\ \emptyset ,\ \sigma )\rangle 
\end{array}
$$

**(Init-Step)**

$$
\begin{array}{l}
\operatorname{InitItem}(L,\ \mathsf{mi},\ \mathsf{ii})\ =\ e\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma )\rangle \ \to \ \langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii}\ +\ 1,\ P,\ \sigma ')\rangle 
\end{array}
$$

**(Init-Next-Module)**

$$
\begin{array}{l}
\operatorname{InitLen}(L,\ \mathsf{mi})\ =\ k\quad \mathsf{ii}\ =\ k \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma )\rangle \ \to \ \langle \operatorname{InitMod}(L,\ \mathsf{mi}\ +\ 1,\ 0,\ P,\ \sigma )\rangle 
\end{array}
$$

**(Init-Panic)**

$$
\begin{array}{l}
\operatorname{InitItem}(L,\ \mathsf{mi},\ \mathsf{ii})\ =\ e\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')\quad L[\mathsf{mi}]\ =\ m\quad P'\ =\ P\ \cup \ \{m\}\ \cup \ \{x\ \mid \ \operatorname{Reachable}(x,\ m,\ E_{\mathsf{val}}^\{\mathsf{eager}\})\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma )\rangle \ \to \ \langle \operatorname{InitPanic}(P',\ \sigma ')\rangle 
\end{array}
$$

**(Init-Done)**
mi = |L|

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma )\rangle \ \to \ \langle \operatorname{InitDone}(\sigma )\rangle 
\end{array}
$$

**(Init-Ok)**

$$
\begin{array}{l}
\langle \operatorname{InitStart}(G_{e},\ \operatorname{InitOrder}(G_{e}),\ \sigma )\rangle \ \to *\ \langle \operatorname{InitDone}(\sigma ')\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

**(Init-Fail)**

$$
\begin{array}{l}
\langle \operatorname{InitStart}(G_{e},\ \operatorname{InitOrder}(G_{e}),\ \sigma )\rangle \ \to *\ \langle \operatorname{InitPanic}(P,\ \sigma ')\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma )\ \Uparrow \ \operatorname{panic}(P)
\end{array}
$$

**(Deinit-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DeinitList}(P),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

**(Deinit-Panic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DeinitList}(P),\ \sigma )\ \Downarrow \ (\mathsf{panic},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma )\ \Uparrow \ \mathsf{panic}
\end{array}
$$

### 24.4.3 Entry Symbols and Context Construction

$$
\mathsf{EntryJudg}\ =\ \{\mathsf{EntrySym}\ \Downarrow \ \mathsf{sym},\ \mathsf{ContextInitSym}\ \Downarrow \ \mathsf{sym},\ \operatorname{EntryStub}(P)\ \Downarrow \ \mathsf{IRDecl}\}
$$

**(EntrySym-Decl)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{EntrySym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"main"}])
\end{array}
$$

**(ContextInitSym-Decl)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{ContextInitSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"context\_init"}])
\end{array}
$$

$$
\mathsf{ProcessInvocation}\ =\ \langle \mathsf{executable}_{\mathsf{path}},\ \mathsf{arguments},\ \mathsf{current}_{\mathsf{directory}}\rangle 
$$

$$
\begin{array}{l}
\operatorname{ProcessInvocationNormalization}(\mathsf{host})\ \Downarrow \ \mathsf{inv}\ \Leftrightarrow  \\[0.16em]
\ \mathsf{inv}.\mathsf{executable}_{\mathsf{path}}\ \mathsf{is}\ \mathsf{the}\ \mathsf{host}\ \mathsf{executable}\ \mathsf{path}\ \mathsf{normalized}\ \mathsf{to}\ \mathsf{UTF}-8\ \mathsf{text}\ \land  \\[0.16em]
\ \mathsf{inv}.\mathsf{arguments}\ \mathsf{is}\ \mathsf{the}\ \mathsf{ordered}\ \mathsf{list}\ \mathsf{of}\ \mathsf{host}\ \mathsf{command}\ \mathsf{arguments}\ \mathsf{after}\ \mathsf{the}\ \mathsf{executable}\ \mathsf{path}, \\[0.16em]
\quad \mathsf{each}\ \mathsf{normalized}\ \mathsf{to}\ \mathsf{UTF}-8\ \mathsf{text}\ \land  \\[0.16em]
\ \mathsf{inv}.\mathsf{current}_{\mathsf{directory}}\ \mathsf{is}\ \mathsf{the}\ \mathsf{host}\ \mathsf{current}\ \mathsf{working}\ \mathsf{directory}\ \mathsf{normalized}\ \mathsf{to}\ \mathsf{UTF}-8\ \mathsf{text}
\end{array}
$$

A conforming runtime MUST isolate platform-specific process startup, argv, path
encoding, and current-directory acquisition behind the runtime host/platform
boundary. Source programs observe only the normalized `System` methods defined
by `SystemInterface`.

$$
\begin{array}{l}
\operatorname{PanicRecordInit}(\sigma )\ \Leftrightarrow \ \operatorname{PanicRecordOf}(\sigma )\ =\ \langle \mathsf{false},\ 0\rangle  \\[0.16em]
\operatorname{EntryStubSpec}(P,\ \mathsf{IR}_{\mathsf{entry}})\ \Leftrightarrow \ \operatorname{Executable}(P)\ \land \ \exists \ d,\ \mathsf{main}_{\mathsf{sym}}.\ \operatorname{MainDecls}(P)\ =\ [d]\ \land \ \Gamma \ \vdash \ \operatorname{Mangle}(d)\ \Downarrow \ \mathsf{main}_{\mathsf{sym}}\ \land \ \forall \ \sigma .\ \exists \ \mathsf{ctx},\ \mathsf{arg},\ \mathsf{ret},\ c,\ \sigma_{1} ,\ \sigma_{2} ,\ \sigma_{3} . \\[0.16em]
\ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{ContextInitSym},\ []),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{ctx}),\ \sigma_{1} )\ \land \ \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(\operatorname{MainArgType}(d)),\ \mathsf{ctx})\ \Downarrow \ \mathsf{arg}\ \land \ \operatorname{PanicRecordInit}(\sigma_{1} )\ \land \ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{main}_{\mathsf{sym}},\ [\mathsf{arg},\ \mathsf{PanicOutName}]),\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{ret}),\ \sigma_{2} )\ \land  \\[0.16em]
\ (\operatorname{PanicRecordOf}(\sigma_{2} )\ =\ \langle \mathsf{true},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{PanicSym},\ [c]),\ \sigma_{2} )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{3} ))\ \land  \\[0.16em]
\ (\operatorname{PanicRecordOf}(\sigma_{2} )\ =\ \langle \mathsf{false},\ c\rangle \ \Rightarrow \ \exists \ \mathsf{IR}_{d}.\ \Gamma \ \vdash \ \operatorname{EmitDeinitPlan}(P)\ \Downarrow \ \mathsf{IR}_{d}\ \land \ \operatorname{ExecIRSigma}(\mathsf{IR}_{d},\ \sigma_{2} )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{3} ))\ \land  \\[0.16em]
\ (\operatorname{PanicRecordOf}(\sigma_{2} )\ =\ \langle \mathsf{true},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR}_{\mathsf{entry}},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{3} ))\ \land  \\[0.16em]
\ (\operatorname{PanicRecordOf}(\sigma_{2} )\ =\ \langle \mathsf{false},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR}_{\mathsf{entry}},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{ret}),\ \sigma_{3} ))
\end{array}
$$

**(EntryStub-Decl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{EntrySym}\ \Downarrow \ \mathsf{sym}\quad \operatorname{EntryStubSpec}(P,\ \mathsf{IR}_{\mathsf{entry}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EntryStub}(P)\ \Downarrow \ \operatorname{ProcIR}(\mathsf{sym},\ [],\ \operatorname{TypePrim}(\texttt{"i32"}),\ \mathsf{IR}_{\mathsf{entry}})
\end{array}
$$

**(EntrySym-Err)**
EntrySym undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{EntrySym}\ \Uparrow 
\end{array}
$$

**(EntryStub-Err)**
EntryStub(P) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EntryStub}(P)\ \Uparrow 
\end{array}
$$

### 24.4.4 Library Images and Hosted Library Sessions

$$
\mathsf{LibraryImageJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{LibraryImageInitSigma}(P,\ i,\ \sigma )\ \Downarrow \ \sigma ',\ \Gamma \ \vdash \ \operatorname{RawLibraryCallSigma}(P,\ i,\ d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{LibraryImageDestroySigma}(P,\ i,\ \sigma )\ \Downarrow \ \sigma '\}
$$
LibraryImageHandle(i) is an abstract predicate over loaded shared-library images.

$$
\begin{array}{l}
\operatorname{LibraryImageValid}(P,\ i,\ \sigma )\ \Leftrightarrow \ \operatorname{LibraryImageHandle}(i)\ \land \ \operatorname{LibraryImageOwner}(i)\ =\ P\ \land \ \operatorname{LibraryImageLive}(i,\ \sigma ) \\[0.16em]
\mathsf{LibraryImageOwner}\ :\ \mathsf{LibraryImage}\ \to \ \mathsf{Project} \\[0.16em]
\mathsf{LibraryImageLive}\ :\ \mathsf{LibraryImage}\ \times \ \mathsf{Store}\ \to \ \mathsf{Bool} \\[0.16em]
\mathsf{AddrOfImageSym}\ :\ \mathsf{LibraryImage}\ \times \ \mathsf{Symbol}\ \to \ \mathsf{Addr} \\[0.16em]
\mathsf{ImagePanicRecordOf}\ :\ \mathsf{Store}\ \times \ \mathsf{LibraryImage}\ \to \ \langle \mathsf{pending},\ \mathsf{code}\rangle  \\[0.16em]
\operatorname{ImagePanicRecordInit}(\sigma ,\ i)\ \Leftrightarrow \ \operatorname{ImagePanicRecordOf}(\sigma ,\ i)\ =\ \langle \mathsf{false},\ 0\rangle  \\[0.16em]
\operatorname{DistinctLibraryImageState}(\sigma )\ \Leftrightarrow \ \forall \ i_{1},\ i_{2}.\ i_{1}\ \ne \ i_{2}\ \land \ \operatorname{LibraryImageLive}(i_{1},\ \sigma )\ \land \ \operatorname{LibraryImageLive}(i_{2},\ \sigma )\ \Rightarrow \ \forall \ \mathsf{sym}.\ (\operatorname{SharedLibraryStateSym}(\operatorname{LibraryImageOwner}(i_{1}),\ \mathsf{sym})\ \lor \ \operatorname{SharedLibraryStateSym}(\operatorname{LibraryImageOwner}(i_{2}),\ \mathsf{sym}))\ \Rightarrow \ \operatorname{AddrOfImageSym}(i_{1},\ \mathsf{sym})\ \ne \ \operatorname{AddrOfImageSym}(i_{2},\ \mathsf{sym})
\end{array}
$$

A conforming implementation MUST ensure `DistinctLibraryImageState(σ)` for every store `σ`.
A conforming implementation MUST ensure that every successful `LibraryImageInitSigma(P, i, σ) ⇓ σ'` establishes `LibraryImageLive(i, σ')`, every successful `RawLibraryCallSigma(P, i, d, vs, σ) ⇓ (out, σ')` establishes `LibraryImageLive(i, σ')`, and every successful `LibraryImageDestroySigma(P, i, σ) ⇓ σ'` establishes `¬ LibraryImageLive(i, σ')`.
A conforming implementation MUST ensure that whenever `Γ ⊢ LibraryImageInitSigma(P, i, σ) ⇓ σ'`, `ReadAddr(σ', AddrOfImageSym(i, sym))` is defined for every `sym` satisfying `SharedLibraryStateSym(P, sym)`, and the initial contents of that cell equal the value denoted by the `GlobalConst` or `GlobalZero` template emitted for `sym` by §§24.4.1, 24.7.8, and 24.7.13.
A conforming implementation MUST ensure that whenever `Γ ⊢ LibraryImageDestroySigma(P, i, σ) ⇓ σ'`, the cells previously reachable at `AddrOfImageSym(i, sym)` for `SharedLibraryStateSym(P, sym)` are no longer live.
For `SharedLibrary(P)`, within the dynamic extent of `LibraryImageInitSigma(P, i, σ)` and `LibraryImageDestroySigma(P, i, σ)`, every occurrence of `AddrOfSym(sym)` in Chapters 6, 24.4, and 24.5 with `SharedLibraryStateSym(P, sym)` MUST be interpreted as `AddrOfImageSym(i, sym)` for the active loaded image `i`, and every boundary panic-record operation MUST be interpreted through `ImagePanicRecordOf(_, i)`. For `RawExportLibrary(P)`, that same image interpretation also governs `RawLibraryCallSigma(P, i, d, vs, σ)`.
If initialization of one module `m_j` within `LibraryImageInitSigma(P, i, σ)` or `HostSessionInitSigma(P, σ)` panics after only a strict prefix of that module's responsible static bindings has completed `StaticStoreIR`, cleanup MUST be limited to the successfully initialized prefix. The implementation MUST execute `DropStaticActionOut(m_j, x_t), ..., DropStaticActionOut(m_j, x_1)` only for the completed prefix `[x_1, ..., x_t]` in reverse order, MUST NOT execute the remaining static deinit actions of `m_j`, MUST execute full module deinit only for the earlier modules whose init completed successfully, and MUST NOT deinitialize any later module.

A raw export call from foreign code on `RawExportLibrary(P)` occurs only with one live loaded library image `i` owned by `P`. Before the first raw export call through a newly loaded image, the implementation MUST establish that live image by `LibraryImageInitSigma(P, i, σ)`. Later raw export calls through the same live image MUST reuse that image-owned state. On library unload of that live image, the implementation MUST execute `LibraryImageDestroySigma(P, i, σ)` exactly once.
An ordinary Ultraviolet call that crosses a shared-library link boundary into `SharedLibrary(P)` likewise occurs only with one live loaded library image `i` owned by `P`. Before the first such linked call through a newly loaded image, the implementation MUST establish that live image by `LibraryImageInitSigma(P, i, σ)`. Later linked calls through the same live image MUST reuse that image-owned state. On library unload of that live image, the implementation MUST execute `LibraryImageDestroySigma(P, i, σ)` exactly once.
On targets whose shared-library linker selects one loader entrypoint symbol for process attach/detach, a conforming backend MUST emit exactly one backend-generated loader entrypoint for each linked image of `SharedLibrary(P)`. That loader entrypoint is not a user-declared `ProcedureDecl`. It MUST establish `LibraryImageInitSigma(P, i, σ)` before user code first becomes callable from that image, MUST execute `LibraryImageDestroySigma(P, i, σ)` on image unload, and MUST NOT expose any additional capability-bearing parameter to Ultraviolet user code.

**(LibraryImageInitSigma)**

$$
\begin{array}{l}
\operatorname{SharedLibrary}(P)\quad \operatorname{LibraryImageHandle}(i)\quad \operatorname{LibraryImageOwner}(i)\ =\ P\quad \operatorname{ImagePanicRecordInit}(\sigma ,\ i)\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma )\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LibraryImageInitSigma}(P,\ i,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

**(RawLibraryCallSigma-Ok)**

$$
\begin{array}{l}
\operatorname{LibraryImageValid}(P,\ i,\ \sigma )\quad \operatorname{RawExportLibrary}(P)\quad d\ \in \ \operatorname{RawExports}(P)\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RawLibraryCallSigma}(P,\ i,\ d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(LibraryImageDestroySigma)**

$$
\begin{array}{l}
\operatorname{LibraryImageValid}(P,\ i,\ \sigma )\quad \operatorname{SharedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma )\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LibraryImageDestroySigma}(P,\ i,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

$$
\mathsf{HostedSessionJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{HostSessionInitSigma}(P,\ \sigma )\ \Downarrow \ (\operatorname{Val}(h),\ \sigma '),\ \Gamma \ \vdash \ \operatorname{HostedCallSigma}(P,\ h,\ d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{HostSessionDestroySigma}(P,\ h,\ \sigma )\ \Downarrow \ \sigma '\}
$$
SessionHandle(h) is an abstract predicate over hosted-library session handles. At the foreign ABI, hosted-library session handles are represented as nonzero `usize` tokens.

$$
\begin{array}{l}
\operatorname{SessionValid}(P,\ h,\ \sigma )\ \Leftrightarrow \ \operatorname{SessionHandle}(h)\ \land \ \operatorname{HostedSessionOwner}(h)\ =\ P\ \land \ \operatorname{SessionLive}(h,\ \sigma ) \\[0.16em]
\operatorname{SessionReady}(P,\ h,\ \sigma )\ \Leftrightarrow \ \operatorname{SessionValid}(P,\ h,\ \sigma )\ \land \ \lnot \ \operatorname{SessionBusy}(h,\ \sigma ) \\[0.16em]
\mathsf{HostedSessionOwner}\ :\ \mathsf{Session}\ \to \ \mathsf{Project} \\[0.16em]
\mathsf{SessionContext}\ :\ \mathsf{Session}\ \to \ \mathsf{Value} \\[0.16em]
\mathsf{HostedGrantedCaps}\ :\ \mathsf{Project}\ \times \ \mathsf{Session}\ \to \ \mathcal{P} (\mathsf{CapToken}) \\[0.16em]
\operatorname{HostedGrantVisible}(P,\ h,\ T)\ \Leftrightarrow \ \operatorname{CapInType}(\operatorname{StripPerm}(T))\ \subseteq \ \operatorname{HostedGrantedCaps}(P,\ h) \\[0.16em]
\mathsf{SessionLive}\ :\ \mathsf{Session}\ \times \ \mathsf{Store}\ \to \ \mathsf{Bool} \\[0.16em]
\mathsf{SessionBusy}\ :\ \mathsf{Session}\ \times \ \mathsf{Store}\ \to \ \mathsf{Bool} \\[0.16em]
\operatorname{DistinctHostedState}(\sigma )\ \Leftrightarrow \ \forall \ h_{1},\ h_{2}.\ h_{1}\ \ne \ h_{2}\ \land \ \operatorname{SessionLive}(h_{1},\ \sigma )\ \land \ \operatorname{SessionLive}(h_{2},\ \sigma )\ \Rightarrow \ \forall \ \mathsf{sym}.\ (\operatorname{HostedStateSym}(\operatorname{HostedSessionOwner}(h_{1}),\ \mathsf{sym})\ \lor \ \operatorname{HostedStateSym}(\operatorname{HostedSessionOwner}(h_{2}),\ \mathsf{sym}))\ \Rightarrow \ \operatorname{AddrOfSessionSym}(h_{1},\ \mathsf{sym})\ \ne \ \operatorname{AddrOfSessionSym}(h_{2},\ \mathsf{sym})
\end{array}
$$

A conforming implementation MUST ensure `DistinctHostedState(σ)` for every store `σ`.
A conforming implementation MUST ensure that every successful `HostSessionInitSigma(P, σ) ⇓ (Val(h), σ')` establishes `SessionLive(h, σ') ∧ ¬ SessionBusy(h, σ') ∧ HostedGrantedCaps(P, h) = HostedRootCaps(P)`, every successful `HostedCallSigma(P, h, d, vs, σ) ⇓ (out, σ')` establishes `SessionLive(h, σ') ∧ ¬ SessionBusy(h, σ')`, and every successful `HostSessionDestroySigma(P, h, σ) ⇓ σ'` establishes `¬ SessionLive(h, σ')`.
A hosted-library session MUST NOT be entered concurrently or reentrantly. While one hosted call or destroy operation on `h` is in progress, the implementation MUST treat `SessionBusy(h, _)` as true for that operation and MUST reject any second hosted entry on the same session according to §23.3.12.

**(HostSessionInitSigma)**

$$
\begin{array}{l}
\operatorname{HostedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \operatorname{SessionHandle}(h)\quad \operatorname{HostedSessionOwner}(h)\ =\ P\quad \operatorname{SessionContext}(h)\ =\ v_{\mathsf{ctx}}\quad \operatorname{HostedGrantedCaps}(P,\ h)\ =\ \operatorname{HostedRootCaps}(P)\quad \Gamma \ \vdash \ \operatorname{SessionStateInitSigma}(P,\ h,\ \sigma_{0} )\ \Downarrow \ \sigma_{s} \quad \operatorname{SessionPanicRecordInit}(\sigma_{s} ,\ h)\quad (\forall \ d\ \in \ \operatorname{HostExports}(P).\ \operatorname{HostContextParam}(d)\ =\ \langle \_,\ \_,\ T_{d}\rangle \ \Rightarrow \ \operatorname{HostedGrantVisible}(P,\ h,\ T_{d})\ \land \ \exists \ v_{d}.\ \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(T_{d}),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{d})\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{s} )\ \Downarrow \ \sigma_{1}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostSessionInitSigma}(P,\ \sigma )\ \Downarrow \ (\operatorname{Val}(h),\ \sigma_{1} )
\end{array}
$$

**(HostedCallSigma-Ok)**

$$
\begin{array}{l}
\operatorname{SessionReady}(P,\ h,\ \sigma )\quad \operatorname{HostedLibrary}(P)\quad \operatorname{HostExported}(d)\quad d\ \in \ \operatorname{HostExports}(P)\quad \operatorname{HostContextParam}(d)\ =\ \langle \_,\ \_,\ T_{\mathsf{ctx}}\rangle \quad \operatorname{HostedGrantVisible}(P,\ h,\ T_{\mathsf{ctx}})\quad \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(T_{\mathsf{ctx}}),\ \operatorname{SessionContext}(h))\ \Downarrow \ v_{\mathsf{ctx}}\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ [v_{\mathsf{ctx}}]\ \mathbin{++} \ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostedCallSigma}(P,\ h,\ d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(HostSessionDestroySigma)**

$$
\begin{array}{l}
\operatorname{SessionReady}(P,\ h,\ \sigma )\quad \Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma )\ \Downarrow \ \sigma_{1} \quad \Gamma \ \vdash \ \operatorname{SessionStateDestroySigma}(P,\ h,\ \sigma_{1} )\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostSessionDestroySigma}(P,\ h,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

### 24.4.5 Interpreter Entrypoint

$$
\begin{array}{l}
\mathsf{InterpJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma '),\ \Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Uparrow \ \operatorname{panic}(P_{s})\} \\[0.16em]
\operatorname{ContextValue}(v)\ \Leftrightarrow \ \exists \ \mathsf{bits}.\ \operatorname{ValueBits}(\operatorname{TypePath}([\texttt{"Context"}]),\ v)\ =\ \mathsf{bits}
\end{array}
$$

**(ContextInitSigma)**
ContextValue(v_ctx)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma )
\end{array}
$$

**(Interpret-Project-Ok)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainSigOk}(d)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{0} )\ \Downarrow \ \sigma_{1} \quad \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(\operatorname{MainArgType}(d)),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{\mathsf{arg}}\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ [v_{\mathsf{arg}}],\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma_{2} )\ \Downarrow \ \sigma_{3}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{3} )
\end{array}
$$

**(Interpret-Project-Init-Panic)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainSigOk}(d)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{0} )\ \Uparrow \ \operatorname{panic}(P_{s}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Uparrow \ \operatorname{panic}(P_{s})
\end{array}
$$

**(Interpret-Project-Main-Ctrl)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainSigOk}(d)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{0} )\ \Downarrow \ \sigma_{1} \quad \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(\operatorname{MainArgType}(d)),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{\mathsf{arg}}\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ [v_{\mathsf{arg}}],\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )\quad \kappa \ \in \ \{\mathsf{Panic},\ \mathsf{Abort}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

**(Interpret-Project-Deinit-Panic)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainSigOk}(d)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{0} )\ \Downarrow \ \sigma_{1} \quad \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(\operatorname{MainArgType}(d)),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{\mathsf{arg}}\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ [v_{\mathsf{arg}}],\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma_{2} )\ \Uparrow \ \mathsf{panic} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Uparrow \ \mathsf{panic}
\end{array}
$$
