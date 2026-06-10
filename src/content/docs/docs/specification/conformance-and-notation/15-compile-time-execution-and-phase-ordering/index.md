---
title: "1.5 Compile-Time Execution and Phase Ordering"
description: "1.5 Compile-Time Execution and Phase Ordering from 1. Conformance and Notation of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "conformance-and-notation"
specSection: "15-compile-time-execution-and-phase-ordering"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/conformance-and-notation/">1. Conformance and Notation</a>
  <span>Conformance and Notation</span>
</div>

## 1.5 Compile-Time Execution and Phase Ordering

$$
\begin{array}{l}
\mathsf{TranslationPhases}\ =\ [\mathsf{Phase1},\ \mathsf{Phase2},\ \mathsf{Phase3},\ \mathsf{Phase4}] \\[0.16em]
\mathsf{Phase1}\ =\ \mathsf{ParseAndAggregate} \\[0.16em]
\mathsf{Phase2}\ =\ \mathsf{ExecuteComptime} \\[0.16em]
\mathsf{Phase3}\ =\ \mathsf{ResolveAndTypecheck} \\[0.16em]
\mathsf{Phase4}\ =\ \mathsf{LowerAndEmit}
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ExecuteComptime}(P,\ \mathsf{Ms})\ \Downarrow \ \mathsf{Ms}_{\mathsf{ct}}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ComptimePass}(P,\ \mathsf{Ms})\ \Downarrow \ \mathsf{Ms}_{\mathsf{ct}}
$$

1. Phase 1 MUST parse and aggregate all modules before Phase 2 begins.
2. Phase 2 MUST execute all compile-time forms over the Phase 1 module set in the deterministic module order defined by §22.1.5.
3. Any declaration emitted during Phase 2 MUST be incorporated into the module set before Phase 3 begins.
4. Phase 3 MUST resolve names and discharge static semantics against the Phase 2-expanded module set.
5. Phase 4 MUST lower and emit only the program accepted by Phase 3.

The syntax and semantics of compile-time forms are defined by Chapter 22.
