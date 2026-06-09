---
title: "6.5 Dynamic Scope Stack, Bindings, and Region Runtime"
description: "6.5 Dynamic Scope Stack, Bindings, and Region Runtime from 6. Abstract Machine, Objects, Responsibility, and Authority of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "abstract-machine-objects-responsibility-and-authority"
specSection: "65-dynamic-scope-stack-bindings-and-region-runtime"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/">6. Abstract Machine, Objects, Responsibility, and Authority</a>
  <span>Abstract Machine, Objects, Responsibility, and Authority</span>
</div>

## 6.5 Dynamic Scope Stack, Bindings, and Region Runtime

### 6.5.1 Dynamic Scope Stack and Binding Store

$$
\begin{array}{l}
\mathsf{ScopeEntry}\ =\ \langle \mathsf{scope}_{\mathsf{id}},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle  \\[0.16em]
\operatorname{ScopeId}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle )\ =\ \mathsf{sid} \\[0.16em]
\operatorname{ScopeCleanup}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle )\ =\ \mathsf{cleanup} \\[0.16em]
\operatorname{ScopeNames}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle )\ =\ \mathsf{names} \\[0.16em]
\operatorname{ScopeVals}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle )\ =\ \mathsf{vals} \\[0.16em]
\operatorname{ScopeStates}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle )\ =\ \mathsf{states}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ScopeStack}(\sigma )\ \in \ [\mathsf{ScopeEntry}] \\[0.16em]
\operatorname{CurrentScope}(\sigma )\ =\ \mathsf{scope}\ \Leftrightarrow \ \operatorname{ScopeStack}(\sigma )\ =\ \mathsf{scope}\ \mathbin{::} \ \mathsf{ss} \\[0.16em]
\operatorname{CurrentScopeId}(\sigma )\ =\ \operatorname{ScopeId}(\operatorname{CurrentScope}(\sigma )) \\[0.16em]
\operatorname{ScopeEmpty}(\mathsf{sid})\ =\ \langle \mathsf{sid},\ [],\ \emptyset ,\ \emptyset ,\ \emptyset \rangle  \\[0.16em]
\operatorname{FreshScopeId}(\sigma )\ =\ \mathsf{sid}\ \Rightarrow \ \forall \ s\ \in \ \operatorname{ScopeStack}(\sigma ).\ \operatorname{ScopeId}(s)\ \ne \ \mathsf{sid}
\end{array}
$$

$$
\operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{ss})\ =\ \sigma '\ \Leftrightarrow \ \operatorname{ScopeStack}(\sigma ')\ =\ \mathsf{ss}\ \land \ \operatorname{AddrTags}(\sigma ')\ =\ \operatorname{AddrTags}(\sigma )\ \land \ \operatorname{RegionStack}(\sigma ')\ =\ \operatorname{RegionStack}(\sigma )\ \land \ \operatorname{RegionArena}(\sigma ')\ =\ \operatorname{RegionArena}(\sigma )\ \land \ \operatorname{PoisonedModules}(\sigma ')\ =\ \operatorname{PoisonedModules}(\sigma )
$$

$$
\begin{array}{l}
\mathsf{PushScope}\_\sigma (\sigma )\ \Downarrow \ (\sigma ',\ \mathsf{scope})\ \Leftrightarrow \ \mathsf{scope}\ =\ \operatorname{ScopeEmpty}(\mathsf{sid})\ \land \ \operatorname{FreshScopeId}(\sigma )\ =\ \mathsf{sid}\ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{scope}\ \mathbin{::} \ \operatorname{ScopeStack}(\sigma ))\ =\ \sigma ' \\[0.16em]
\mathsf{PopScope}\_\sigma (\sigma )\ \Downarrow \ (\sigma ',\ \mathsf{scope})\ \Leftrightarrow \ \operatorname{ScopeStack}(\sigma )\ =\ \mathsf{scope}\ \mathbin{::} \ \mathsf{ss}\ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{ss})\ =\ \sigma '
\end{array}
$$

$$
\operatorname{AppendCleanup}(\sigma ,\ \mathsf{item})\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ScopeStack}(\sigma )\ =\ \mathsf{scope}\ \mathbin{::} \ \mathsf{ss}\ \land \ \mathsf{scope}\ =\ \langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle \ \land \ \mathsf{scope}'\ =\ \langle \mathsf{sid},\ \mathsf{cleanup}\ \mathbin{++} \ [\mathsf{item}],\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle \ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{scope}'\ \mathbin{::} \ \mathsf{ss})\ =\ \sigma '
$$

$$
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \operatorname{ScopeCleanup}(\mathsf{scope}) \\[0.16em]
\operatorname{ScopeById}([],\ \mathsf{sid})\ =\ \bot  \\[0.16em]
\operatorname{ScopeById}(\mathsf{scope}\ \mathbin{::} \ \mathsf{ss},\ \mathsf{sid})\ = \\[0.16em]
\ \mathsf{scope}\quad \mathsf{if}\ \operatorname{ScopeId}(\mathsf{scope})\ =\ \mathsf{sid} \\[0.16em]
\ \operatorname{ScopeById}(\mathsf{ss},\ \mathsf{sid})\quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReplaceScopeById}([],\ \mathsf{sid},\ \mathsf{scope}')\ =\ \bot  \\[0.16em]
\operatorname{ReplaceScopeById}(\mathsf{scope}\ \mathbin{::} \ \mathsf{ss},\ \mathsf{sid},\ \mathsf{scope}')\ = \\[0.16em]
\ \mathsf{scope}'\ \mathbin{::} \ \mathsf{ss}\quad \mathsf{if}\ \operatorname{ScopeId}(\mathsf{scope})\ =\ \mathsf{sid} \\[0.16em]
\ \mathsf{scope}\ \mathbin{::} \ \operatorname{ReplaceScopeById}(\mathsf{ss},\ \mathsf{sid},\ \mathsf{scope}')\ \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{xs},\ \sigma )\ \Downarrow \ \sigma '\ \Leftrightarrow \ \mathsf{sid}\ =\ \operatorname{ScopeId}(\mathsf{scope})\ \land \ \mathsf{scope}'\ =\ \langle \mathsf{sid},\ \mathsf{xs},\ \operatorname{ScopeNames}(\mathsf{scope}),\ \operatorname{ScopeVals}(\mathsf{scope}),\ \operatorname{ScopeStates}(\mathsf{scope})\rangle \ \land \ \operatorname{ReplaceScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid},\ \mathsf{scope}')\ =\ \mathsf{ss}'\ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{ss}')\ =\ \sigma '
$$

$$
\operatorname{PoisonedModule}(\sigma ,\ \mathsf{path})\ \Leftrightarrow \ \exists \ m.\ \operatorname{PathOfModule}(m)\ =\ \mathsf{path}\ \land \ \operatorname{ReadAddr}(\sigma ,\ \operatorname{AddrOfSym}(\operatorname{PoisonFlag}(m)))\ \ne \ 0
$$

For hosted-library session execution, §24.4.1 reinterprets the `AddrOfSym(PoisonFlag(m))` occurrence above session-locally for every hosted-state symbol.

$$
\operatorname{PoisonedModules}(\sigma )\ =\ \{\mathsf{path}\ \mid \ \operatorname{PoisonedModule}(\sigma ,\ \mathsf{path})\}
$$

$$
\begin{array}{l}
\mathsf{Binding}\ =\ \langle \mathsf{scope}_{\mathsf{id}},\ \mathsf{bind}_{\mathsf{id}},\ \mathsf{name}\rangle  \\[0.16em]
\mathsf{BindingValue}\ =\ \mathsf{Value}\ \cup \ \{\operatorname{Alias}(\mathsf{addr})\ \mid \ \mathsf{addr}\ \in \ \mathsf{Addr}\}
\end{array}
$$

$$
\operatorname{FreshBindId}(\sigma )\ =\ b\ \Rightarrow \ \forall \ x.\ \operatorname{ScopeNames}(\operatorname{CurrentScope}(\sigma ))[x]\ \mathsf{defined}\ \Rightarrow \ b\ \notin \ \operatorname{ScopeNames}(\operatorname{CurrentScope}(\sigma ))[x]
$$

$$
\begin{array}{l}
\operatorname{Last}([a])\ =\ a \\[0.16em]
\operatorname{Last}(a\ \mathbin{::} \ \mathsf{as})\ =\ \operatorname{Last}(\mathsf{as})\quad (\mid \mathsf{as}\mid \ >\ 0)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{NearestScope}([],\ x)\ =\ \bot  \\[0.16em]
\operatorname{NearestScope}(\mathsf{scope}\ \mathbin{::} \ \mathsf{ss},\ x)\ = \\[0.16em]
\ \mathsf{scope}\quad \mathsf{if}\ \operatorname{ScopeNames}(\mathsf{scope})[x]\ \mathsf{defined} \\[0.16em]
\ \operatorname{NearestScope}(\mathsf{ss},\ x)\quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LookupBind}(\sigma ,\ x)\ =\ \langle \operatorname{ScopeId}(\mathsf{scope}),\ b,\ x\rangle \ \Leftrightarrow \ \operatorname{NearestScope}(\operatorname{ScopeStack}(\sigma ),\ x)\ =\ \mathsf{scope}\ \land \ b\ =\ \operatorname{Last}(\operatorname{ScopeNames}(\mathsf{scope})[x]) \\[0.16em]
\operatorname{BindingValue}(\sigma ,\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ =\ v\ \Leftrightarrow \ \operatorname{ScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid})\ =\ \mathsf{scope}\ \land \ \operatorname{ScopeVals}(\mathsf{scope})[\mathsf{bind}_{\mathsf{id}}]\ =\ v \\[0.16em]
\operatorname{BindState}(\sigma ,\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ =\ s\ \Leftrightarrow \ \operatorname{ScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid})\ =\ \mathsf{scope}\ \land \ \operatorname{ScopeStates}(\mathsf{scope})[\mathsf{bind}_{\mathsf{id}}]\ =\ s
\end{array}
$$

**(LookupVal-Bind-Value)**

$$
\begin{array}{l}
\operatorname{LookupBind}(\sigma ,\ x)\ =\ b\quad \operatorname{BindingValue}(\sigma ,\ b)\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupVal}(\sigma ,\ x)\ =\ v
\end{array}
$$

**(LookupVal-Bind-Alias)**

$$
\begin{array}{l}
\operatorname{LookupBind}(\sigma ,\ x)\ =\ b\quad \operatorname{BindingValue}(\sigma ,\ b)\ =\ \operatorname{Alias}(\mathsf{addr})\quad \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupVal}(\sigma ,\ x)\ =\ v
\end{array}
$$

**(LookupVal-Path)**

$$
\begin{array}{l}
\operatorname{LookupBind}(\sigma ,\ x)\ \mathsf{undefined}\quad \Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \mathsf{name}\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ x)\quad \lnot \ \operatorname{PoisonedModule}(\sigma ,\ \operatorname{PathOfModule}(\mathsf{mp}))\quad \operatorname{LookupValPath}(\sigma ,\ \operatorname{PathOfModule}(\mathsf{mp}),\ \mathsf{name})\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupVal}(\sigma ,\ x)\ =\ v
\end{array}
$$

**(LookupValPath-Builtin)**

$$
\begin{array}{l}
\operatorname{BuiltinValuePath}(\mathsf{path},\ \mathsf{name})\quad ((\mathsf{path}\ =\ [\texttt{"Region"}]\ \land \ \mathsf{name}\ =\ \texttt{new\_scoped}\ \land \ \Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\texttt{Region::new\_scoped})\ \Downarrow \ \mathsf{sym})\ \lor \ (\mathsf{path}\ =\ [\texttt{"CancelToken"}]\ \land \ \mathsf{name}\ =\ \texttt{new}\ \land \ \Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\texttt{CancelToken::new})\ \Downarrow \ \mathsf{sym})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupValPath}(\sigma ,\ \mathsf{path},\ \mathsf{name})\ =\ \operatorname{FuncVal}(\mathsf{sym})
\end{array}
$$

**(LookupValPath-Static)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \mathsf{path}'\ =\ \operatorname{PathOfModule}(\mathsf{mp})\quad \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\quad \lnot \ \operatorname{PoisonedModule}(\sigma ,\ \mathsf{path}')\quad \operatorname{StaticAddr}(\mathsf{path}',\ \mathsf{name}')\ =\ \mathsf{addr}\quad \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupValPath}(\sigma ,\ \mathsf{path},\ \mathsf{name})\ =\ v
\end{array}
$$

**(LookupValPath-Proc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \mathsf{path}'\ =\ \operatorname{PathOfModule}(\mathsf{mp})\quad \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\quad \lnot \ \operatorname{PoisonedModule}(\sigma ,\ \mathsf{path}')\quad \operatorname{DeclOf}(\mathsf{path}',\ \mathsf{name}')\ =\ \mathsf{proc}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{proc})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupValPath}(\sigma ,\ \mathsf{path},\ \mathsf{name})\ =\ \operatorname{FuncVal}(\mathsf{sym})
\end{array}
$$

**(LookupValPath-RecordCtor)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p\quad \operatorname{SplitLast}(p)\ =\ (\mathsf{mp},\ \_)\quad \lnot \ \operatorname{PoisonedModule}(\sigma ,\ \mathsf{mp}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{LookupValPath}(\sigma ,\ \mathsf{path},\ \mathsf{name})\ =\ \operatorname{RecordCtor}(p)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ScopeValsUpdate}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle ,\ \mathsf{bind}_{\mathsf{id}},\ v)\ =\ \langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals}[\mathsf{bind}_{\mathsf{id}}\ \mapsto \ v],\ \mathsf{states}\rangle  \\[0.16em]
\operatorname{ScopeStatesUpdate}(\langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle ,\ \mathsf{bind}_{\mathsf{id}},\ s)\ =\ \langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}[\mathsf{bind}_{\mathsf{id}}\ \mapsto \ s]\rangle 
\end{array}
$$

$$
\operatorname{UpdateVal}(\sigma ,\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle ,\ v)\ \Downarrow \ \sigma '\ \Leftrightarrow \ (\operatorname{BindingValue}(\sigma ,\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ =\ \operatorname{Alias}(\mathsf{addr})\ \land \ \operatorname{WriteAddr}(\sigma ,\ \mathsf{addr},\ v)\ \Downarrow \ \sigma ')\ \lor \ (\operatorname{BindingValue}(\sigma ,\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ \ne \ \operatorname{Alias}(\_)\ \land \ \operatorname{ScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid})\ =\ \mathsf{scope}\ \land \ \mathsf{scope}'\ =\ \operatorname{ScopeValsUpdate}(\mathsf{scope},\ \mathsf{bind}_{\mathsf{id}},\ v)\ \land \ \operatorname{ReplaceScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid},\ \mathsf{scope}')\ =\ \mathsf{ss}'\ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{ss}')\ =\ \sigma ')
$$

$$
\operatorname{SetState}(\sigma ,\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle ,\ s)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid})\ =\ \mathsf{scope}\ \land \ \mathsf{scope}'\ =\ \operatorname{ScopeStatesUpdate}(\mathsf{scope},\ \mathsf{bind}_{\mathsf{id}},\ s)\ \land \ \operatorname{ReplaceScopeById}(\operatorname{ScopeStack}(\sigma ),\ \mathsf{sid},\ \mathsf{scope}')\ =\ \mathsf{ss}'\ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{ss}')\ =\ \sigma '
$$

$$
\begin{array}{l}
\operatorname{TypeOf}(\langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ =\ \operatorname{TypeOf}(x) \\[0.16em]
\operatorname{BindInfo}(\langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ =\ \operatorname{BindInfo}(x)
\end{array}
$$

$$
\operatorname{BindVal}(\sigma ,\ x,\ v)\ \Downarrow \ (\sigma ',\ b)\ \Leftrightarrow \ \operatorname{ScopeStack}(\sigma )\ =\ \mathsf{scope}\ \mathbin{::} \ \mathsf{ss}\ \land \ \mathsf{scope}\ =\ \langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle \ \land \ \mathsf{bind}_{\mathsf{id}}\ =\ \operatorname{FreshBindId}(\sigma )\ \land \ \mathsf{names}'\ =\ \mathsf{names}[x\ \mapsto \ (\mathsf{names}[x]\ \mathsf{if}\ \mathsf{present}\ \mathsf{else}\ [])\ \mathbin{++} \ [\mathsf{bind}_{\mathsf{id}}]]\ \land \ \mathsf{vals}'\ =\ \mathsf{vals}[\mathsf{bind}_{\mathsf{id}}\ \mapsto \ v]\ \land \ \mathsf{states}'\ =\ \mathsf{states}[\mathsf{bind}_{\mathsf{id}}\ \mapsto \ \texttt{Valid}]\ \land \ \mathsf{scope}'\ =\ \langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names}',\ \mathsf{vals}',\ \mathsf{states}'\rangle \ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{scope}'\ \mathbin{::} \ \mathsf{ss})\ =\ \sigma_{1} \ \land \ b\ =\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle \ \land \ ((\operatorname{BindInfo}(b).\mathsf{resp}\ =\ \mathsf{resp}\ \land \ \operatorname{AppendCleanup}(\sigma_{1} ,\ \operatorname{DropBinding}(b))\ \Downarrow \ \sigma ')\ \lor \ (\operatorname{BindInfo}(b).\mathsf{resp}\ \ne \ \mathsf{resp}\ \land \ \sigma '\ =\ \sigma_{1} ))
$$

$$
\begin{array}{l}
\operatorname{BindPatternVal}(p,\ v)\ \Downarrow \ B\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{MatchPattern}(p,\ v)\ \Downarrow \ B \\[0.16em]
\operatorname{BindOrder}(p,\ B)\ =\ [\langle x,\ B[x]\rangle \ \mid \ x\ \in \ \operatorname{PatNames}(p)]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BindList}(\sigma ,\ [])\ \Downarrow \ (\sigma ,\ []) \\[0.16em]
\operatorname{BindList}(\sigma ,\ [\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ (\sigma_{2} ,\ b\ \mathbin{::} \ \mathsf{bs})\ \Leftrightarrow \ \operatorname{BindVal}(\sigma ,\ x,\ v)\ \Downarrow \ (\sigma_{1} ,\ b)\ \land \ \operatorname{BindList}(\sigma_{1} ,\ \mathsf{xs})\ \Downarrow \ (\sigma_{2} ,\ \mathsf{bs})
\end{array}
$$

$$
\operatorname{BindPattern}(\sigma ,\ p,\ v)\ \Downarrow \ (\sigma ',\ \mathsf{bs})\ \Leftrightarrow \ \operatorname{BindPatternVal}(p,\ v)\ \Downarrow \ B\ \land \ \operatorname{BindOrder}(p,\ B)\ =\ \mathsf{binds}\ \land \ \operatorname{BindList}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma ',\ \mathsf{bs})
$$

### 6.5.2 Region Stack and Arenas

$$
\begin{array}{l}
\mathsf{RegionEntry}\ =\ \langle \mathsf{tag},\ \mathsf{target},\ \mathsf{scope},\ \mathsf{mark}_{\mathsf{opt}}\rangle  \\[0.16em]
\operatorname{RegionTagOf}(\langle \mathsf{tag},\ \mathsf{target},\ \mathsf{scope},\ \mathsf{mark}_{\mathsf{opt}}\rangle )\ =\ \mathsf{tag} \\[0.16em]
\operatorname{RegionTargetOf}(\langle \mathsf{tag},\ \mathsf{target},\ \mathsf{scope},\ \mathsf{mark}_{\mathsf{opt}}\rangle )\ =\ \mathsf{target} \\[0.16em]
\operatorname{RegionScopeOf}(\langle \mathsf{tag},\ \mathsf{target},\ \mathsf{scope},\ \mathsf{mark}_{\mathsf{opt}}\rangle )\ =\ \mathsf{scope} \\[0.16em]
\operatorname{RegionMarkOf}(\langle \mathsf{tag},\ \mathsf{target},\ \mathsf{scope},\ \mathsf{mark}_{\mathsf{opt}}\rangle )\ =\ \mathsf{mark}_{\mathsf{opt}}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{RuntimeTag}\ =\ \{\operatorname{RegionTag}(\mathsf{tag}),\ \operatorname{ScopeTag}(\mathsf{sid})\} \\[0.16em]
\operatorname{RegionStack}(\sigma )\ \in \ [\mathsf{RegionEntry}] \\[0.16em]
\operatorname{AddrTags}(\sigma )\ :\ \mathsf{Addr}\ \rightharpoonup \ \mathsf{RuntimeTag}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RegionArena}(\sigma )\ :\ \mathsf{usize}\ \rightharpoonup \ [\mathsf{Addr}] \\[0.16em]
\operatorname{ArenaAllocs}(\sigma ,\ r)\ =\ \mathsf{allocs}\ \Leftrightarrow \ \operatorname{RegionArena}(\sigma )(r)\ =\ \mathsf{allocs}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{UpdateRegionArena}(\sigma ,\ \mathsf{RA})\ =\ \sigma '\ \Leftrightarrow \ \operatorname{RegionArena}(\sigma ')\ =\ \mathsf{RA}\ \land \ \operatorname{ScopeStack}(\sigma ')\ =\ \operatorname{ScopeStack}(\sigma )\ \land \ \operatorname{AddrTags}(\sigma ')\ =\ \operatorname{AddrTags}(\sigma )\ \land \ \operatorname{RegionStack}(\sigma ')\ =\ \operatorname{RegionStack}(\sigma )\ \land \ \operatorname{PoisonedModules}(\sigma ')\ =\ \operatorname{PoisonedModules}(\sigma ) \\[0.16em]
\operatorname{ArenaNew}(\sigma ,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{UpdateRegionArena}(\sigma ,\ \operatorname{RegionArena}(\sigma )[r\ \mapsto \ []])\ =\ \sigma '
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FreshAddr}(\sigma )\ =\ \mathsf{addr}\ \Rightarrow \ \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ \mathsf{undefined}\ \land \ \operatorname{AddrTags}(\sigma )(\mathsf{addr})\ \mathsf{undefined} \\[0.16em]
\operatorname{Prefix}([a_{0},\ \ldots ,\ a\_\{n-1\}],\ m)\ =\ [a_{0},\ \ldots ,\ a\_\{m-1\}]\quad (0\ \le \ m\ \le \ n)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ArenaAppend}(\sigma ,\ r,\ \mathsf{addr})\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ArenaAllocs}(\sigma ,\ r)\ =\ \mathsf{allocs}\ \land \ \operatorname{UpdateRegionArena}(\sigma ,\ \operatorname{RegionArena}(\sigma )[r\ \mapsto \ \mathsf{allocs}\ \mathbin{++} \ [\mathsf{addr}]])\ =\ \sigma ' \\[0.16em]
\operatorname{ArenaMark}(\sigma ,\ r)\ =\ m\ \Leftrightarrow \ \operatorname{ArenaAllocs}(\sigma ,\ r)\ =\ \mathsf{allocs}\ \land \ m\ =\ \mid \mathsf{allocs}\mid  \\[0.16em]
\operatorname{ArenaResetTo}(\sigma ,\ r,\ m)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ArenaAllocs}(\sigma ,\ r)\ =\ \mathsf{allocs}\ \land \ 0\ \le \ m\ \le \ \mid \mathsf{allocs}\mid \ \land \ \mathsf{allocs}'\ =\ \operatorname{Prefix}(\mathsf{allocs},\ m)\ \land \ \operatorname{UpdateRegionArena}(\sigma ,\ \operatorname{RegionArena}(\sigma )[r\ \mapsto \ \mathsf{allocs}'])\ =\ \sigma ' \\[0.16em]
\operatorname{ArenaClear}(\sigma ,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ArenaResetTo}(\sigma ,\ r,\ 0)\ \Downarrow \ \sigma ' \\[0.16em]
\operatorname{ArenaRemove}(\sigma ,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{RegionArena}(\sigma ')\ =\ \operatorname{RegionArena}(\sigma )\ \setminus \ \{r\}\ \land \ \operatorname{ScopeStack}(\sigma ')\ =\ \operatorname{ScopeStack}(\sigma )\ \land \ \operatorname{AddrTags}(\sigma ')\ =\ \operatorname{AddrTags}(\sigma )\ \land \ \operatorname{RegionStack}(\sigma ')\ =\ \operatorname{RegionStack}(\sigma )\ \land \ \operatorname{PoisonedModules}(\sigma ')\ =\ \operatorname{PoisonedModules}(\sigma )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RegionValue}(S,\ h)\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{Region}],\ S),\ [\langle \texttt{handle},\ \operatorname{IntVal}(\texttt{"usize"},\ h)\rangle ]) \\[0.16em]
\operatorname{RegionHandleOf}(v)\ =\ h\ \Leftrightarrow \ v\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{Region}],\ S),\ \mathsf{io})\ \land \ \langle \texttt{handle},\ \operatorname{IntVal}(\texttt{"usize"},\ h)\rangle \ \in \ \mathsf{io}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ResolveEntry}([],\ r)\ =\ \bot  \\[0.16em]
\operatorname{ResolveEntry}(e\ \mathbin{::} \ \mathsf{es},\ r)\ = \\[0.16em]
\ e\quad \mathsf{if}\ \operatorname{RegionTargetOf}(e)\ =\ r \\[0.16em]
\ \operatorname{ResolveEntry}(\mathsf{es},\ r)\ \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ActiveEntry}(\sigma )\ =\ e\ \Leftrightarrow \ \operatorname{RegionStack}(\sigma )\ =\ e\ \mathbin{::} \ \mathsf{es} \\[0.16em]
\operatorname{ActiveTarget}(\sigma )\ =\ \mathsf{target}\ \Leftrightarrow \ \operatorname{ActiveEntry}(\sigma )\ =\ e\ \land \ \operatorname{RegionTargetOf}(e)\ =\ \mathsf{target} \\[0.16em]
\operatorname{ResolveTarget}(\sigma ,\ r)\ =\ \mathsf{target}\ \Leftrightarrow \ \operatorname{ResolveEntry}(\operatorname{RegionStack}(\sigma ),\ r)\ =\ e\ \land \ \operatorname{RegionTargetOf}(e)\ =\ \mathsf{target} \\[0.16em]
\operatorname{ResolveTag}(\sigma ,\ r)\ =\ \mathsf{tag}\ \Leftrightarrow \ \operatorname{ResolveEntry}(\operatorname{RegionStack}(\sigma ),\ r)\ =\ e\ \land \ \operatorname{RegionTagOf}(e)\ =\ \mathsf{tag} \\[0.16em]
\operatorname{FreshTag}(\sigma )\ =\ \mathsf{tag}\ \Rightarrow \ \forall \ e\ \in \ \operatorname{RegionStack}(\sigma ).\ \operatorname{RegionTagOf}(e)\ \ne \ \mathsf{tag} \\[0.16em]
\operatorname{FreshArena}(\sigma )\ =\ r\ \Rightarrow \ \forall \ e\ \in \ \operatorname{RegionStack}(\sigma ).\ \operatorname{RegionTargetOf}(e)\ \ne \ r
\end{array}
$$

$$
\operatorname{UpdateRegionStack}(\sigma ,\ \mathsf{rs})\ =\ \sigma '\ \Leftrightarrow \ \operatorname{RegionStack}(\sigma ')\ =\ \mathsf{rs}\ \land \ \operatorname{ScopeStack}(\sigma ')\ =\ \operatorname{ScopeStack}(\sigma )\ \land \ \operatorname{AddrTags}(\sigma ')\ =\ \operatorname{AddrTags}(\sigma )\ \land \ \operatorname{RegionArena}(\sigma ')\ =\ \operatorname{RegionArena}(\sigma )\ \land \ \operatorname{PoisonedModules}(\sigma ')\ =\ \operatorname{PoisonedModules}(\sigma )
$$

$$
\begin{array}{l}
\operatorname{RegionNew}(\sigma ,\ \mathsf{opts})\ \Downarrow \ (\sigma ',\ r,\ \mathsf{scope})\ \Leftrightarrow \ \mathsf{PushScope}\_\sigma (\sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ \operatorname{FreshArena}(\sigma )\ =\ r\ \land \ \operatorname{ArenaNew}(\sigma_{1} ,\ r)\ \Downarrow \ \sigma_{2} \ \land \ \operatorname{UpdateRegionStack}(\sigma_{2} ,\ \langle r,\ r,\ \mathsf{scope},\ \bot \rangle \ \mathbin{::} \ \operatorname{RegionStack}(\sigma_{2} ))\ =\ \sigma ' \\[0.16em]
\operatorname{RegionOpen}(\sigma ,\ \mathsf{opts})\ \Downarrow \ (\sigma ',\ r)\ \Leftrightarrow \ \operatorname{FreshArena}(\sigma )\ =\ r\ \land \ \operatorname{ArenaNew}(\sigma ,\ r)\ \Downarrow \ \sigma_{1} \ \land \ \operatorname{UpdateRegionStack}(\sigma_{1} ,\ \langle r,\ r,\ \operatorname{CurrentScopeId}(\sigma ),\ \bot \rangle \ \mathbin{::} \ \operatorname{RegionStack}(\sigma_{1} ))\ =\ \sigma ' \\[0.16em]
\operatorname{FrameEnter}(\sigma ,\ r)\ \Downarrow \ (\sigma ',\ F,\ \mathsf{scope},\ \mathsf{mark})\ \Leftrightarrow \ \mathsf{PushScope}\_\sigma (\sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ F\ =\ \operatorname{FreshTag}(\sigma )\ \land \ \mathsf{mark}\ =\ \operatorname{FrameMark}(\sigma_{1} ,\ r)\ \land \ \operatorname{UpdateRegionStack}(\sigma_{1} ,\ \langle F,\ r,\ \mathsf{scope},\ \mathsf{mark}\rangle \ \mathbin{::} \ \operatorname{RegionStack}(\sigma_{1} ))\ =\ \sigma '
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BindRegionAlias}(\sigma ,\ \bot ,\ r)\ \Downarrow \ \sigma  \\[0.16em]
\operatorname{BindRegionAlias}(\sigma ,\ x,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{BindVal}(\sigma ,\ x,\ \operatorname{RegionValue}(\texttt{@Active},\ r))\ \Downarrow \ (\sigma ',\ b)
\end{array}
$$

$$
\operatorname{TagAddr}(\sigma ,\ \mathsf{addr},\ \mathsf{tag})\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{AddrTags}(\sigma ')\ =\ \operatorname{AddrTags}(\sigma )[\mathsf{addr}\ \mapsto \ \mathsf{tag}]\ \land \ \operatorname{ScopeStack}(\sigma ')\ =\ \operatorname{ScopeStack}(\sigma )\ \land \ \operatorname{RegionStack}(\sigma ')\ =\ \operatorname{RegionStack}(\sigma )\ \land \ \operatorname{RegionArena}(\sigma ')\ =\ \operatorname{RegionArena}(\sigma )\ \land \ \operatorname{PoisonedModules}(\sigma ')\ =\ \operatorname{PoisonedModules}(\sigma )
$$

$$
\operatorname{TagAddrFrom}(\sigma ,\ \mathsf{base},\ \mathsf{addr})\ \Downarrow \ \sigma '\ \Leftrightarrow \ (\operatorname{AddrTag}(\sigma ,\ \mathsf{base})\ =\ \mathsf{tag}\ \land \ \operatorname{TagAddr}(\sigma ,\ \mathsf{addr},\ \mathsf{tag})\ \Downarrow \ \sigma ')\ \lor \ (\operatorname{AddrTag}(\sigma ,\ \mathsf{base})\ =\ \bot \ \land \ \sigma '\ =\ \sigma )
$$

$$
\operatorname{RegionAlloc}(\sigma ,\ r,\ v)\ \Downarrow \ (\sigma ',\ v')\ \Leftrightarrow \ \operatorname{ResolveTag}(\sigma ,\ r)\ =\ \mathsf{tag}\ \land \ \operatorname{FreshAddr}(\sigma )\ =\ \mathsf{addr}\ \land \ \operatorname{WriteAddr}(\sigma ,\ \mathsf{addr},\ v)\ \Downarrow \ \sigma_{1} \ \land \ \operatorname{ArenaAppend}(\sigma_{1} ,\ r,\ \mathsf{addr})\ \Downarrow \ \sigma_{2} \ \land \ \operatorname{TagAddr}(\sigma_{2} ,\ \mathsf{addr},\ \operatorname{RegionTag}(\mathsf{tag}))\ \Downarrow \ \sigma '\ \land \ \operatorname{ReadAddr}(\sigma ',\ \mathsf{addr})\ =\ v'
$$

$$
\operatorname{FreshTags}(\sigma ,\ \mathsf{tags})\ \Leftrightarrow \ \operatorname{Distinct}(\mathsf{tags})\ \land \ \forall \ \mathsf{tag}\ \in \ \operatorname{Set}(\mathsf{tags}).\ \forall \ e\ \in \ \operatorname{RegionStack}(\sigma ).\ \operatorname{RegionTagOf}(e)\ \ne \ \mathsf{tag}
$$

$$
\begin{array}{l}
\operatorname{RetagRegions}([],\ r,\ \mathsf{tags})\ =\ []\ \Leftrightarrow \ \mathsf{tags}\ =\ [] \\[0.16em]
\operatorname{RetagRegions}(e\ \mathbin{::} \ \mathsf{es},\ r,\ \mathsf{tags})\ = \\[0.16em]
\ e'\ \mathbin{::} \ \operatorname{RetagRegions}(\mathsf{es},\ r,\ \mathsf{tags}')\quad \mathsf{if}\ \operatorname{RegionTargetOf}(e)\ =\ r\ \land \ \mathsf{tags}\ =\ \mathsf{tag}\ \mathbin{::} \ \mathsf{tags}'\ \land \ e'\ =\ \langle \mathsf{tag},\ \operatorname{RegionTargetOf}(e),\ \operatorname{RegionScopeOf}(e),\ \operatorname{RegionMarkOf}(e)\rangle  \\[0.16em]
\ e\ \mathbin{::} \ \operatorname{RetagRegions}(\mathsf{es},\ r,\ \mathsf{tags})\quad \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{RegionReset}(\sigma ,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ArenaClear}(\sigma ,\ r)\ \Downarrow \ \sigma_{1} \ \land \ \operatorname{FreshTags}(\sigma_{1} ,\ \mathsf{tags})\ \land \ \operatorname{RetagRegions}(\operatorname{RegionStack}(\sigma_{1} ),\ r,\ \mathsf{tags})\ =\ \mathsf{rs}'\ \land \ \operatorname{UpdateRegionStack}(\sigma_{1} ,\ \mathsf{rs}')\ =\ \sigma '
$$

$$
\begin{array}{l}
\operatorname{PopRegions}([],\ r)\ =\ [] \\[0.16em]
\operatorname{PopRegions}(e\ \mathbin{::} \ \mathsf{es},\ r)\ = \\[0.16em]
\ \operatorname{PopRegions}(\mathsf{es},\ r)\quad \mathsf{if}\ \operatorname{RegionTargetOf}(e)\ =\ r \\[0.16em]
\ e\ \mathbin{::} \ \operatorname{PopRegions}(\mathsf{es},\ r)\quad \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{RegionFree}(\sigma ,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ArenaRemove}(\sigma ,\ r)\ \Downarrow \ \sigma_{1} \ \land \ \operatorname{PopRegions}(\operatorname{RegionStack}(\sigma_{1} ),\ r)\ =\ \mathsf{rs}'\ \land \ \operatorname{UpdateRegionStack}(\sigma_{1} ,\ \mathsf{rs}')\ =\ \sigma '
$$

$$
\begin{array}{l}
\operatorname{FrameMark}(\sigma ,\ r)\ =\ \operatorname{ArenaMark}(\sigma ,\ r) \\[0.16em]
\operatorname{PopRegionScope}([],\ \mathsf{scope})\ =\ \bot  \\[0.16em]
\operatorname{PopRegionScope}(e\ \mathbin{::} \ \mathsf{es},\ \mathsf{scope})\ = \\[0.16em]
\ \{\ \mathsf{es}\quad \mathsf{if}\ \operatorname{RegionScopeOf}(e)\ =\ \mathsf{scope} \\[0.16em]
\quad \operatorname{PopRegionScope}(\mathsf{es},\ \mathsf{scope})\ \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{ReleaseArena}(\sigma ,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{RegionFree}(\sigma ,\ r)\ \Downarrow \ \sigma ' \\[0.16em]
\operatorname{ResetArena}(\sigma ,\ r,\ \mathsf{scope},\ \mathsf{mark})\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{ArenaResetTo}(\sigma ,\ r,\ \mathsf{mark})\ \Downarrow \ \sigma_{1} \ \land \ \operatorname{PopRegionScope}(\operatorname{RegionStack}(\sigma_{1} ),\ \mathsf{scope})\ =\ \mathsf{rs}'\ \land \ \operatorname{UpdateRegionStack}(\sigma_{1} ,\ \mathsf{rs}')\ =\ \sigma '
\end{array}
$$

Cleanup, unwinding, initialization, deinitialization, and interpreter entry are defined in Chapter 24. This chapter defines only the dynamic scope-stack, binding-store, and region-runtime machinery those sections consume.

### 6.5.3 Runtime Value, Block, and Address Helpers

**Region Deallocation Order.**
`RegionRelease` and `FrameReset` MUST execute `CleanupScope` before any `ArenaResetTo` or `ArenaRemove`.
`ArenaResetTo`, `ArenaClear`, and `ArenaRemove` MUST NOT invoke `Drop`; they only reclaim arena storage.

$$
\mathsf{RegionProcJudg}\ =\ \{\operatorname{RegionNewScoped}(\sigma ,\ \mathsf{opts})\ \Downarrow \ (\sigma ',\ v),\ \operatorname{RegionAllocProc}(\sigma ,\ v_{r},\ v)\ \Downarrow \ (\sigma ',\ v'),\ \operatorname{RegionResetProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v'),\ \operatorname{RegionFreezeProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v'),\ \operatorname{RegionThawProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v'),\ \operatorname{RegionFreeProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v')\}
$$

**(Region-New-Scoped)**

$$
\begin{array}{l}
\operatorname{RegionOpen}(\sigma ,\ \mathsf{opts})\ \Downarrow \ (\sigma ',\ r)\quad v\ =\ \operatorname{RegionValue}(\texttt{@Active},\ r) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RegionNewScoped}(\sigma ,\ \mathsf{opts})\ \Downarrow \ (\sigma ',\ v)
\end{array}
$$

**(Region-Alloc-Proc)**

$$
\begin{array}{l}
\operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{ResolveTarget}(\sigma ,\ h)\ =\ r_{t}\quad \operatorname{RegionAlloc}(\sigma ,\ r_{t},\ v)\ \Downarrow \ (\sigma ',\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RegionAllocProc}(\sigma ,\ v_{r},\ v)\ \Downarrow \ (\sigma ',\ v')
\end{array}
$$

**(Region-Reset-Proc)**

$$
\begin{array}{l}
\operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{RegionReset}(\sigma ,\ h)\ \Downarrow \ \sigma '\quad v'\ =\ \operatorname{RegionValue}(\texttt{@Active},\ h) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RegionResetProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v')
\end{array}
$$

**(Region-Freeze-Proc)**

$$
\begin{array}{l}
\operatorname{RegionHandleOf}(v_{r})\ =\ h\quad v'\ =\ \operatorname{RegionValue}(\texttt{@Frozen},\ h) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RegionFreezeProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ,\ v')
\end{array}
$$

**(Region-Thaw-Proc)**

$$
\begin{array}{l}
\operatorname{RegionHandleOf}(v_{r})\ =\ h\quad v'\ =\ \operatorname{RegionValue}(\texttt{@Active},\ h) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RegionThawProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ,\ v')
\end{array}
$$

**(Region-Free-Proc)**

$$
\begin{array}{l}
\operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{RegionFree}(\sigma ,\ h)\ \Downarrow \ \sigma '\quad v'\ =\ \operatorname{RegionValue}(\texttt{@Freed},\ h) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RegionFreeProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v')
\end{array}
$$

$$
\operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma ',\ \mathsf{scope})\ \Leftrightarrow \ \mathsf{PushScope}\_\sigma (\sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ \exists \ \mathsf{bs}.\ \operatorname{BindList}(\sigma_{1} ,\ \mathsf{binds})\ \Downarrow \ (\sigma ',\ \mathsf{bs})
$$

$$
\begin{array}{l}
\operatorname{BoolVal}(b)\ =\ b\ \Leftrightarrow \ b\ \in \ \{\mathsf{true},\ \mathsf{false}\} \\[0.16em]
\operatorname{CharVal}(u)\ =\ u\ \Leftrightarrow \ u\ \in \ \mathsf{UnicodeScalar} \\[0.16em]
\mathsf{UnitVal}\ =\ () \\[0.16em]
\operatorname{IntVal}(t,\ x)\ \mathsf{defined}\ \Leftrightarrow \ t\ \in \ \mathsf{IntTypes}\ \land \ \operatorname{InRange}(x,\ t) \\[0.16em]
\operatorname{IntValType}(\operatorname{IntVal}(t,\ x))\ =\ t \\[0.16em]
\operatorname{IntValValue}(\operatorname{IntVal}(t,\ x))\ =\ x \\[0.16em]
\operatorname{FloatVal}(t,\ v)\ \mathsf{defined}\ \Leftrightarrow \ t\ \in \ \mathsf{FloatTypes}\ \land \ v\ \in \ \operatorname{FloatValueSet}(t) \\[0.16em]
\operatorname{FloatValType}(\operatorname{FloatVal}(t,\ v))\ =\ t \\[0.16em]
\operatorname{FloatValValue}(\operatorname{FloatVal}(t,\ v))\ =\ v \\[0.16em]
\operatorname{PtrVal}(s,\ \mathsf{addr})\ \mathsf{defined}\ \Leftrightarrow \ s\ \in \ \mathsf{PtrStateSet} \\[0.16em]
\mathsf{TupleVal}\ =\ \{(v_{1},\ \ldots ,\ v_{n})\ \mid \ n\ \ge \ 0\} \\[0.16em]
\mathsf{ArrayVal}\ =\ \{[v_{1},\ \ldots ,\ v_{n}]\ \mid \ n\ \ge \ 0\} \\[0.16em]
\operatorname{FuncVal}(\mathsf{sym})\ \mathsf{defined}\ \Leftrightarrow \ \mathsf{sym}\ \in \ \mathsf{Symbol} \\[0.16em]
\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}})\ \mathsf{defined}\ \Leftrightarrow \ (\mathsf{env}_{\mathsf{ptr}}\ =\ \mathsf{null}\ \lor \ \mathsf{env}_{\mathsf{ptr}}\ \in \ \mathsf{Addr})\ \land \ \mathsf{code}_{\mathsf{ptr}}\ \in \ \mathsf{Symbol} \\[0.16em]
\mathsf{RangeVal}\ =\ \{\operatorname{RangeVal}(k,\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}})\ \mid \ k\ \in \ \mathsf{RangeKind}\} \\[0.16em]
\operatorname{ModalVal}(S,\ v)\ =\ \langle S,\ v\rangle 
\end{array}
$$
RecordValue(tr, io) defined

$$
\begin{array}{l}
\mathsf{EnumPayloadVal}\ =\ \{\bot ,\ \operatorname{TuplePayload}(\mathsf{vec}_{v}),\ \operatorname{RecordPayload}(\mathsf{vec}_{f})\} \\[0.16em]
\operatorname{EnumValue}(\mathsf{path},\ \mathsf{payload})\ \mathsf{defined}\ \Leftrightarrow \ \mathsf{payload}\ \in \ \mathsf{EnumPayloadVal} \\[0.16em]
\operatorname{SliceValue}(v,\ r)\ \mathsf{defined}\ \Leftrightarrow \ \operatorname{SliceBounds}(r,\ \operatorname{Len}(v))\ \mathsf{defined} \\[0.16em]
\mathsf{Value}\ =\ \{\operatorname{BoolVal}(b)\ \mid \ b\ \in \ \{\mathsf{true},\ \mathsf{false}\}\}\ \cup \ \{\operatorname{CharVal}(u)\ \mid \ u\ \in \ \mathsf{UnicodeScalar}\}\ \cup \ \{\mathsf{UnitVal}\}\ \cup \ \{\operatorname{IntVal}(t,\ x)\ \mid \ \operatorname{IntVal}(t,\ x)\ \mathsf{defined}\}\ \cup \ \{\operatorname{FloatVal}(t,\ v)\ \mid \ \operatorname{FloatVal}(t,\ v)\ \mathsf{defined}\}\ \cup \ \{\operatorname{PtrVal}(s,\ \mathsf{addr})\ \mid \ \operatorname{PtrVal}(s,\ \mathsf{addr})\ \mathsf{defined}\}\ \cup \ \{\operatorname{RawPtr}(q,\ \mathsf{addr})\}\ \cup \ \mathsf{TupleVal}\ \cup \ \mathsf{ArrayVal}\ \cup \ \{\operatorname{RecordValue}(\mathsf{tr},\ \mathsf{io})\}\ \cup \ \{\operatorname{EnumValue}(\mathsf{path},\ \mathsf{payload})\}\ \cup \ \mathsf{RangeVal}\ \cup \ \{\operatorname{SliceValue}(v,\ r)\ \mid \ \operatorname{SliceValue}(v,\ r)\ \mathsf{defined}\}\ \cup \ \{\operatorname{ModalVal}(S,\ v)\}\ \cup \ \{\operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ T)\}\ \cup \ \texttt{string@Managed}\ \cup \ \texttt{string@View}\ \cup \ \texttt{bytes@Managed}\ \cup \ \texttt{bytes@View}\ \cup \ \{\operatorname{FuncVal}(\mathsf{sym})\}\ \cup \ \{\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}})\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TupleValue}((v_{0},\ \ldots ,\ v\_\{n-1\}),\ i)\ =\ v_{i}\quad (0\ \le \ i\ <\ n) \\[0.16em]
\operatorname{TupleUpdate}((v_{0},\ \ldots ,\ v\_\{n-1\}),\ i,\ v')\ =\ (v_{0},\ \ldots ,\ v\_\{i-1\},\ v',\ v\_\{i+1\},\ \ldots ,\ v\_\{n-1\})\quad (0\ \le \ i\ <\ n) \\[0.16em]
\operatorname{FieldValue}(\operatorname{RecordValue}(\mathsf{tr},\ \mathsf{io}),\ f)\ =\ v\ \Leftrightarrow \ \langle f,\ v\rangle \ \in \ \mathsf{io} \\[0.16em]
\operatorname{FieldUpdate}(\operatorname{RecordValue}(\mathsf{tr},\ \mathsf{io}),\ f,\ v')\ =\ \operatorname{RecordValue}(\mathsf{tr},\ \mathsf{io}')\quad \mathsf{where}\ \mathsf{io}'\ =\ [\langle f_{i},\ v_{i}'\rangle \ \mid \ \langle f_{i},\ v_{i}\rangle \ \in \ \mathsf{io}\ \land \ v_{i}'\ =\ v'\ \mathsf{if}\ f_{i}\ =\ f\ \mathsf{otherwise}\ v_{i}] \\[0.16em]
\operatorname{IndexUpdate}([v_{0},\ \ldots ,\ v\_\{n-1\}],\ i,\ v_{e})\ =\ [v_{0},\ \ldots ,\ v\_\{i-1\},\ v_{e},\ v\_\{i+1\},\ \ldots ,\ v\_\{n-1\}]\quad (0\ \le \ i\ <\ n) \\[0.16em]
\operatorname{SliceLen}([v_{0},\ \ldots ,\ v\_\{n-1\}])\ =\ n \\[0.16em]
\operatorname{SliceLen}(\operatorname{SliceValue}(v,\ r))\ =\ \mathsf{end}\ -\ \mathsf{start}\quad (\operatorname{SliceBounds}(r,\ \operatorname{Len}(v))\ =\ (\mathsf{start},\ \mathsf{end})) \\[0.16em]
\operatorname{SliceElem}(v,\ i)\ =\ \operatorname{IndexValue}(v,\ i)\quad (\operatorname{IndexValue}(v,\ i)\ \mathsf{defined}) \\[0.16em]
\operatorname{SliceUpdate}(v,\ \mathsf{start},\ v_{\mathsf{rhs}})\ \Downarrow \ v'\ \Leftrightarrow \ n\ =\ \operatorname{SliceLen}(v_{\mathsf{rhs}})\ \land \ \exists \ v_{0},\ \ldots ,\ v_{n}.\ v_{0}\ =\ v\ \land \ \forall \ i\ \in \ [0,\ n-1].\ v\_\{i+1\}\ =\ \operatorname{IndexUpdate}(v_{i},\ \mathsf{start}\ +\ i,\ \operatorname{SliceElem}(v_{\mathsf{rhs}},\ i))\ \land \ v'\ =\ v_{n}
\end{array}
$$

$$
\mathsf{AddrPrimJudg}\ =\ \{\operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v,\ \operatorname{WriteAddr}(\sigma ,\ \mathsf{addr},\ v)\ \Downarrow \ \sigma ',\ \operatorname{FieldAddr}(T,\ \mathsf{addr},\ f)\ =\ \mathsf{addr}',\ \operatorname{TupleAddr}(T,\ \mathsf{addr},\ i)\ =\ \mathsf{addr}',\ \operatorname{IndexAddr}(T_{b},\ \mathsf{addr},\ i)\ =\ \mathsf{addr}'\}
$$

$$
\begin{array}{l}
\operatorname{AddrAdd}(\mathsf{addr},\ n)\ =\ \mathsf{addr}\ +\ n \\[0.16em]
\operatorname{ElemType}(T_{b})\ =\ T\ \Leftrightarrow \ \operatorname{StripPerm}(T_{b})\ =\ \operatorname{TypeArray}(T,\ \_)\ \lor \ \operatorname{StripPerm}(T_{b})\ =\ \operatorname{TypeSlice}(T) \\[0.16em]
\operatorname{FieldAddr}(T,\ \mathsf{addr},\ f)\ =\ \operatorname{AddrAdd}(\mathsf{addr},\ \operatorname{FieldOffset}(\operatorname{Fields}(R),\ f))\quad \mathsf{when}\ \operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R \\[0.16em]
\operatorname{TupleAddr}(T,\ \mathsf{addr},\ i)\ =\ \operatorname{AddrAdd}(\mathsf{addr},\ \operatorname{FieldOffset}(\operatorname{TupleFields}([T_{1},\ \ldots ,\ T_{n}]),\ i))\quad \mathsf{when}\ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]) \\[0.16em]
\operatorname{IndexLen}(\sigma ,\ \mathsf{addr})\ =\ \operatorname{Len}(v)\quad (\operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v\ \land \ \operatorname{Len}(v)\ \mathsf{defined}) \\[0.16em]
\operatorname{IndexAddr}(T_{b},\ \mathsf{addr},\ i)\ =\ \operatorname{AddrAdd}(\mathsf{addr},\ i\ \times \ \operatorname{sizeof}(\operatorname{ElemType}(T_{b})))\quad (\operatorname{ElemType}(T_{b})\ \mathsf{defined}) \\[0.16em]
\operatorname{IndexAddr}(T_{b},\ \mathsf{addr},\ v_{i})\ =\ \mathsf{addr}'\ \Leftrightarrow \ \operatorname{IndexNum}(v_{i})\ =\ i\ \land \ \operatorname{IndexAddr}(T_{b},\ \mathsf{addr},\ i)\ =\ \mathsf{addr}' \\[0.16em]
\operatorname{SliceLenFromAddr}(\sigma ,\ \mathsf{addr})\ =\ n\ \Leftrightarrow \ \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v\ \land \ \operatorname{SliceLen}(v)\ =\ n
\end{array}
$$

$$
\begin{array}{l}
\mathsf{PtrStateSet}\ =\ \{\texttt{Valid},\ \texttt{Null},\ \texttt{Expired}\} \\[0.16em]
\mathsf{RawQual}\ =\ \{\texttt{imm},\ \texttt{mut}\} \\[0.16em]
\operatorname{PtrAddr}(\mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr}))\ =\ \mathsf{addr} \\[0.16em]
\operatorname{PtrAddr}(\mathsf{Ptr}@\operatorname{Null}(\mathsf{addr}))\ =\ \mathsf{addr} \\[0.16em]
\operatorname{PtrAddr}(\mathsf{Ptr}@\operatorname{Expired}(\mathsf{addr}))\ =\ \mathsf{addr} \\[0.16em]
\operatorname{PtrAddr}(\operatorname{RawPtr}(q,\ \mathsf{addr}))\ =\ \mathsf{addr}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BindAddr}(\langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ \in \ \mathsf{Addr} \\[0.16em]
\operatorname{AddrOfBind}(b)\ = \\[0.16em]
\ \{\ \mathsf{addr}\quad \mathsf{if}\ \operatorname{BindingValue}(\sigma ,\ b)\ =\ \operatorname{Alias}(\mathsf{addr}) \\[0.16em]
\quad \operatorname{BindAddr}(b)\ \mathsf{if}\ \operatorname{BindingValue}(\sigma ,\ b)\ \ne \ \operatorname{Alias}(\_)\ \} \\[0.16em]
\operatorname{AddrOfBind}(x)\ =\ \mathsf{addr}\ \Leftrightarrow \ \exists \ b.\ \operatorname{LookupBind}(\sigma ,\ x)\ =\ b\ \land \ \operatorname{AddrOfBind}(b)\ =\ \mathsf{addr}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ = \\[0.16em]
\ \{\ \operatorname{ScopeTag}(\mathsf{sid})\quad \mathsf{if}\ \mathsf{addr}\ =\ \operatorname{BindAddr}(\langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle ) \\[0.16em]
\quad \operatorname{RegionTag}(\mathsf{tag})\ \mathsf{if}\ \operatorname{AddrTags}(\sigma )(\mathsf{addr})\ =\ \operatorname{RegionTag}(\mathsf{tag}) \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{TagActive}(\sigma ,\ \operatorname{RegionTag}(\mathsf{tag}))\ \Leftrightarrow \ \exists \ e\ \in \ \operatorname{RegionStack}(\sigma ).\ \operatorname{RegionTagOf}(e)\ =\ \mathsf{tag} \\[0.16em]
\operatorname{TagActive}(\sigma ,\ \operatorname{ScopeTag}(\mathsf{sid}))\ \Leftrightarrow \ \exists \ e\ \in \ \operatorname{ScopeStack}(\sigma ).\ \operatorname{ScopeId}(e)\ =\ \mathsf{sid} \\[0.16em]
\operatorname{DynAddrState}(\sigma ,\ \mathsf{addr})\ = \\[0.16em]
\ \{\ \texttt{Valid}\quad \mathsf{if}\ \operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ =\ \bot  \\[0.16em]
\quad \texttt{Valid}\quad \mathsf{if}\ \operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ =\ \mathsf{tag}\ \ne \ \bot \ \land \ \operatorname{TagActive}(\sigma ,\ \mathsf{tag}) \\[0.16em]
\quad \texttt{Expired}\ \mathsf{if}\ \operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ =\ \mathsf{tag}\ \ne \ \bot \ \land \ \lnot \ \operatorname{TagActive}(\sigma ,\ \mathsf{tag})\ \}
\end{array}
$$
