---
title: "23.5 Capability Isolation"
description: "23.5 Capability Isolation from 23. Foreign Function Interface of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "foreign-function-interface"
specSection: "235-capability-isolation"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/foreign-function-interface/">23. Foreign Function Interface</a>
  <span>Foreign Function Interface</span>
</div>

## 23.5 Capability Isolation

### 23.5.1 Syntax

This section introduces no additional concrete syntax.

### 23.5.2 Parsing

This section introduces no additional parsing rules.

### 23.5.3 AST Representation / Form

Capability-isolation checks range over existing FFI signature types and declaration forms; this section introduces no dedicated AST node.

### 23.5.4 Static Semantics

**Capability Isolation.** Foreign code MUST NOT receive or return capability-bearing values.

1. Any raw FFI signature or hosted-export visible signature containing `Context`, a capability class, or a dynamic class object is ill-formed.
2. A raw pointer derived from region-local storage MUST NOT cross an FFI boundary.

$$
\begin{array}{l}
\operatorname{RegionLocalProv}(\pi )\ \Leftrightarrow \ \exists \ \mathsf{tag}.\ \pi \ =\ \pi_{\mathsf{Region}} (\mathsf{tag}) \\[0.16em]
\operatorname{RawPtrType}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeRawPtr}(\_,\ \_) \\[0.16em]
\operatorname{FFICall}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}))\ \Leftrightarrow \ \operatorname{CalleeProc}(\mathsf{callee})\ =\ \mathsf{proc}\ \land \ \operatorname{FFIBoundary}(\mathsf{proc})
\end{array}
$$

**(FFI-Arg-RegionLocalRawPtr-Err)**

$$
\begin{array}{l}
\operatorname{FFICall}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}))\quad \exists \ \langle \_,\ \mathsf{arg},\ \_\rangle \ \in \ \mathsf{args}.\ \Gamma ;\ \Omega \ \vdash \ \mathsf{arg}\ \Downarrow \ \pi \ \land \ \operatorname{RegionLocalProv}(\pi )\ \land \ \operatorname{RawPtrType}(\operatorname{ExprType}(\mathsf{arg})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow 
\end{array}
$$

**(FFI-Return-RegionLocalRawPtr-Err)**

$$
\begin{array}{l}
\operatorname{CurrentProcedure}(\Gamma )\ =\ \mathsf{proc}\quad (\operatorname{ExportAttr}(\mathsf{proc})\ \mathsf{defined}\ \lor \ \operatorname{HostExportAttr}(\mathsf{proc})\ \mathsf{defined})\quad \Gamma ;\ \Omega \ \vdash \ e\ \Downarrow \ \pi \quad \operatorname{RegionLocalProv}(\pi )\quad \operatorname{RawPtrType}(\operatorname{ExprType}(e)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \operatorname{ReturnStmt}(e)\ \Uparrow 
\end{array}
$$

### 23.5.5 Dynamic Semantics

This section introduces no additional runtime mechanism. Ill-formed raw FFI signatures and ill-formed hosted-export visible signatures that would transport capability-bearing values are rejected statically.

### 23.5.6 Lowering

This section introduces no additional lowering rules beyond the signature-admissibility checks defined by §§23.1–23.4.

### 23.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-SYS-3360` | Error    | Compile-time | Region-local raw pointer crosses an FFI boundary |

Capability-bearing-type violations other than region-local raw-pointer escape are diagnosed by the signature and type-admissibility checks owned by §23.1.7.
