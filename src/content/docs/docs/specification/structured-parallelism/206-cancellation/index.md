---
title: "20.6 Cancellation"
description: "20.6 Cancellation from 20. Structured Parallelism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "structured-parallelism"
specSection: "206-cancellation"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/structured-parallelism/">20. Structured Parallelism</a>
  <span>Structured Parallelism</span>
</div>

## 20.6 Cancellation

### 20.6.1 Syntax

This section introduces no additional surface syntax beyond the `cancel` parallel option and ordinary `CancelToken` procedure or method call syntax.

### 20.6.2 Parsing

This section introduces no additional parsing rules.

### 20.6.3 AST Representation / Form

$$
\operatorname{States}(\texttt{CancelToken})\ =\ \{\ \texttt{@Active}\ \}
$$

$$
\operatorname{Payload}(\texttt{CancelToken},\ \texttt{@Active})\ =\ [\langle \texttt{id},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ]
$$

$$
\mathsf{CancelJudg}\ =\ \{\operatorname{CancelNew}()\ \Downarrow \ v,\ \operatorname{CancelChild}(v)\ \Downarrow \ v',\ \operatorname{CancelIsCancelled}(v)\ \Downarrow \ b,\ \operatorname{CancelDoCancel}(v)\ \Downarrow \ \mathsf{ok},\ \operatorname{CancelWaitCancelled}(v)\ \Downarrow \ a\}
$$

$$
\mathsf{CancelJudg}\_\chi \ =\ \{\operatorname{CancelNew}(\chi )\ \Downarrow \ (v,\ \chi '),\ \operatorname{CancelChild}(v,\ \chi )\ \Downarrow \ (v',\ \chi '),\ \operatorname{CancelIsCancelled}(v,\ \chi )\ \Downarrow \ b,\ \operatorname{CancelDoCancel}(v,\ \chi )\ \Downarrow \ \chi ',\ \operatorname{CancelWaitCancelled}(v,\ \chi )\ \Downarrow \ a\}
$$

$$
\mathsf{CancelStatus}\ =\ \{\mathsf{Active},\ \mathsf{Cancelled}\}
$$

$$
\mathsf{CancelState}\ =\ \langle \mathsf{parent},\ \mathsf{status}\rangle 
$$

$$
\mathsf{CancelMap}\ =\ \mathbb{N} \ \rightharpoonup \ \mathsf{CancelState}
$$

### 20.6.4 Static Semantics

`CancelToken` is a built-in modal type.

$$
\texttt{CancelToken::new}\ \mathsf{returns}\ \texttt{CancelToken@Active}.
$$

$$
\texttt{CancelToken@Active::child()}\ \mathsf{returns}\ a\ \mathsf{descendant}\ \texttt{CancelToken@Active}.
$$

$$
\texttt{CancelToken@Active::cancel()}\ \mathsf{returns}\ \texttt{()}.
$$

$$
\texttt{CancelToken@Active::is\_cancelled()}\ \mathsf{returns}\ \texttt{bool}.
$$

$$
\texttt{CancelToken@Active::wait\_cancelled()}\ \mathsf{returns}\ \mathsf{an}\ \texttt{Async}\ \mathsf{value}\ \mathsf{whose}\ \mathsf{eventual}\ \mathsf{completion}\ \mathsf{indicates}\ \mathsf{cancellation}.
$$

### 20.6.5 Dynamic Semantics

When a cancel token is attached to a parallel block via the `cancel` option, the token is implicitly available within all enclosed `spawn` and `dispatch` bodies.

$$
\operatorname{CancelStatusOf}(\chi ,\ \mathsf{id})\ =\ s\ \Leftrightarrow \ \chi [\mathsf{id}]\ =\ \langle \_,\ s\rangle 
$$

$$
\operatorname{CancelParentOf}(\chi ,\ \mathsf{id})\ =\ p\ \Leftrightarrow \ \chi [\mathsf{id}]\ =\ \langle p,\ \_\rangle 
$$

$$
\operatorname{Descendant}(\chi ,\ a,\ b)\ \Leftrightarrow \ (a\ =\ b)\ \lor \ (\exists \ p.\ \operatorname{CancelParentOf}(\chi ,\ b)\ =\ p\ \land \ \operatorname{Descendant}(\chi ,\ a,\ p))
$$

$$
\operatorname{FreshCancelId}(\chi )\ =\ n\ \Leftrightarrow \ n\ \notin \ \operatorname{dom}(\chi )\ \land \ \forall \ m\ <\ n.\ m\ \in \ \operatorname{dom}(\chi )
$$

$$
\operatorname{CancelVal}(n)\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{"CancelToken"}],\ \texttt{@Active}),\ [\langle \texttt{id},\ \operatorname{IntVal}(\texttt{"usize"},\ n)\rangle ])
$$

$$
\operatorname{CancelId}(v)\ =\ n\ \Leftrightarrow \ v\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{"CancelToken"}],\ \texttt{@Active}),\ \mathsf{io})\ \land \ \operatorname{FieldValue}(v,\ \texttt{id})\ =\ \operatorname{IntVal}(\texttt{"usize"},\ n)
$$

**(Cancel-New)**

$$
\begin{array}{l}
\operatorname{FreshCancelId}(\chi )\ =\ n\quad \chi '\ =\ \chi [n\ \mapsto \ \langle \bot ,\ \mathsf{Active}\rangle ] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CancelNew}(\chi )\ \Downarrow \ (\operatorname{CancelVal}(n),\ \chi ')
\end{array}
$$

**(Cancel-Child)**

$$
\begin{array}{l}
\operatorname{CancelId}(v)\ =\ p\quad \operatorname{FreshCancelId}(\chi )\ =\ n\quad \chi '\ =\ \chi [n\ \mapsto \ \langle p,\ \mathsf{Active}\rangle ] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CancelChild}(v,\ \chi )\ \Downarrow \ (\operatorname{CancelVal}(n),\ \chi ')
\end{array}
$$

**(Cancel-IsCancelled)**

$$
\begin{array}{l}
\operatorname{CancelId}(v)\ =\ n\quad \operatorname{CancelStatusOf}(\chi ,\ n)\ =\ s\quad b\ =\ (s\ =\ \mathsf{Cancelled}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CancelIsCancelled}(v,\ \chi )\ \Downarrow \ b
\end{array}
$$

**(Cancel-DoCancel)**

$$
\begin{array}{l}
\operatorname{CancelId}(v)\ =\ n\quad \chi '\ =\ \chi [\ k\ \mapsto \ \langle \operatorname{CancelParentOf}(\chi ,\ k),\ \mathsf{Cancelled}\rangle \ \mid \ k\ \in \ \operatorname{dom}(\chi )\ \land \ \operatorname{Descendant}(\chi ,\ n,\ k)\ ] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CancelDoCancel}(v,\ \chi )\ \Downarrow \ \chi '
\end{array}
$$

**(Cancel-WaitCancelled-Completed)**

$$
\begin{array}{l}
\operatorname{CancelId}(v)\ =\ n\quad \operatorname{CancelStatusOf}(\chi ,\ n)\ =\ \mathsf{Cancelled} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CancelWaitCancelled}(v,\ \chi )\ \Downarrow \ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{"Async"}],\ \texttt{@Completed}),\ [\langle \texttt{value},\ \mathsf{UnitVal}\rangle ])
\end{array}
$$

**(Cancel-WaitCancelled-Suspended)**

$$
\begin{array}{l}
\operatorname{CancelId}(v)\ =\ n\quad \operatorname{CancelStatusOf}(\chi ,\ n)\ =\ \mathsf{Active} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CancelWaitCancelled}(v,\ \chi )\ \Downarrow \ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{"Async"}],\ \texttt{@Suspended}),\ [\langle \texttt{output},\ \mathsf{UnitVal}\rangle ])
\end{array}
$$

Cancellation is cooperative:

| Scenario                       | Behavior                                             |
| ------------------------------ | ---------------------------------------------------- |
| Work checks and returns early  | Iteration completes immediately                      |
| Work ignores cancellation      | Iteration runs to completion                         |
| Work is queued but not started | MUST be dequeued, marked cancelled, and not executed |
| Work is mid-execution          | Continues until next check point                     |

### 20.6.6 Lowering

$$
\mathsf{CancelIR}\ =\ \{\mathsf{CancelCreateIR},\ \mathsf{CancelRequestIR},\ \mathsf{CancelCheckIR},\ \mathsf{CancelWaitIR},\ \mathsf{CancelSuppressIR}\}
$$

**(Lower-Cancel-New)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Call}(\operatorname{PathExpr}([\texttt{CancelToken},\ \texttt{new}]),\ []))\ \Downarrow \ \langle \mathsf{CancelCreateIR},\ \mathsf{CancelTokenVal}\rangle 
\end{array}
$$

**(Lower-Cancel-Request)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MethodCall}(\mathsf{tok},\ \texttt{cancel},\ []))\ \Downarrow \ \langle \operatorname{CancelRequestIR}(\mathsf{tok}),\ \mathsf{UnitVal}\rangle 
\end{array}
$$

**(Lower-Cancel-Wait)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MethodCall}(\mathsf{tok},\ \texttt{wait\_cancelled},\ []))\ \Downarrow \ \langle \operatorname{CancelWaitIR}(\mathsf{tok}),\ \mathsf{AsyncVal}\rangle 
\end{array}
$$

For this rule, explicit cancellation check points are the built-in `CancelToken@Active::is_cancelled()` and `CancelToken@Active::wait_cancelled()` surfaces.

Spawn and dispatch lowerings MUST lower `CancelToken@Active::is_cancelled()` through `CancelCheckIR`, lower `CancelToken@Active::wait_cancelled()` through `CancelWaitIR`, and preserve the `CancelSuppressIR` semantics for dequeued-but-unstarted work that is cancelled before execution begins.

### 20.6.7 Diagnostics

No additional named diagnostics are introduced for cancellation itself.
