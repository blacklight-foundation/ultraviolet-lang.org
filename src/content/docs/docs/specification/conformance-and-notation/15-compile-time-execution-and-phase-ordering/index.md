---
title: "1.5 Compile-Time Execution and Phase Ordering"
description: "1.5 Compile-Time Execution and Phase Ordering from 1. Conformance and Notation of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "conformance-and-notation"
specSection: "15-compile-time-execution-and-phase-ordering"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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
2. Phase 2 MUST execute all compile-time forms over the Phase 1 module set in deterministic dependency order.
3. Any declaration emitted during Phase 2 MUST be incorporated into the module set before Phase 3 begins.
4. Phase 3 MUST resolve names and discharge static semantics against the Phase 2-expanded module set.
5. Phase 4 MUST lower and emit only the program accepted by Phase 3.

The syntax and semantics of compile-time forms are defined by Chapter 22.
