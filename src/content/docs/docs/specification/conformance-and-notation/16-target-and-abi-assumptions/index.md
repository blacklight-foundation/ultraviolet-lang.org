---
title: "1.6 Target and ABI Assumptions"
description: "1.6 Target and ABI Assumptions from 1. Conformance and Notation of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "conformance-and-notation"
specSection: "16-target-and-abi-assumptions"
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

## 1.6 Target and ABI Assumptions

$$
\begin{array}{l}
\mathsf{TargetProfile}\ =\ \{\texttt{x86\_64-sysv},\ \texttt{x86\_64-win64},\ \texttt{aarch64-aapcs64}\} \\[0.16em]
\mathsf{SelectedTargetProfile}\ \in \ \mathsf{TargetProfile}
\end{array}
$$
The selected target profile is resolved once per compilation invocation.
Resolution order is:
1. the explicit CLI target-profile override, if provided;
2. otherwise `toolchain.target_profile` from `Ultraviolet.toml`, if provided;
3. otherwise the compilation invocation is ill-formed.
A conforming implementation MUST NOT silently infer `SelectedTargetProfile` from the host platform.

$$
\begin{array}{l}
\operatorname{TargetArch}(\texttt{x86\_64-sysv})\ =\ \texttt{x86\_64} \\[0.16em]
\operatorname{TargetArch}(\texttt{x86\_64-win64})\ =\ \texttt{x86\_64} \\[0.16em]
\operatorname{TargetArch}(\texttt{aarch64-aapcs64})\ =\ \texttt{aarch64}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Endianness}\ =\ \mathsf{Little} \\[0.16em]
\mathsf{PtrSizeBytes}\ =\ \mathsf{PtrSize}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Target}(\texttt{x86\_64-sysv})\ =\ \texttt{"x86\_64-unknown-linux-gnu"} \\[0.16em]
\operatorname{Target}(\texttt{x86\_64-win64})\ =\ \texttt{"x86\_64-pc-windows-msvc"} \\[0.16em]
\operatorname{Target}(\texttt{aarch64-aapcs64})\ =\ \texttt{"aarch64-unknown-linux-gnu"}
\end{array}
$$

Layout and ABI requirements are defined only by their canonical owner sections in this document, especially Chapters 12, 13, 14.6, and 23.2. The source-draft bundle name `LayoutSpec` is not a separate normative relation in this reorganization.
