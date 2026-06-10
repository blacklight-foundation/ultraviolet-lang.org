---
title: "3.4 Deterministic Ordering and Case Folding"
description: "3.4 Deterministic Ordering and Case Folding from 3. Project and Compilation Model of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "project-and-compilation-model"
specSection: "34-deterministic-ordering-and-case-folding"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/project-and-compilation-model/">3. Project and Compilation Model</a>
  <span>Project and Compilation Model</span>
</div>

## 3.4 Deterministic Ordering and Case Folding

$$
\operatorname{FoldPath}(r)\ =\ \operatorname{JoinComp}([\operatorname{CaseFold}(\operatorname{NFC}(c))\ \mid \ c\ \in \ \operatorname{PathComps}(r)])
$$

$$
\begin{array}{l}
\operatorname{FileKey}(f,\ d)\ = \\[0.16em]
\ \langle \operatorname{FoldPath}(\mathsf{rel}),\ \mathsf{rel}\rangle \ \mathsf{if}\ \operatorname{relative}(f,\ d)\ \Downarrow \ \mathsf{rel} \\[0.16em]
\ \langle \bot ,\ \operatorname{Basename}(f)\rangle \quad \mathsf{if}\ \operatorname{relative}(f,\ d)\ \Uparrow
\end{array}
$$

$$
f_{1}\ \prec_{\mathsf{file}} \ f_{2}\ \Leftrightarrow \ \operatorname{Utf8LexLess}(\operatorname{FileKey}(f_{1},\ d),\ \operatorname{FileKey}(f_{2},\ d))
$$

**(FileOrder-Rel-Fail)**

$$
\begin{array}{l}
\operatorname{relative}(f,\ d)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{FileOrder}-\mathsf{Rel}-\mathsf{Fail}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c)
\end{array}
$$

**Fold.**

$$
\operatorname{Fold}(p)\ =\ [\operatorname{CaseFold}(\operatorname{NFC}(c))\ \mid \ c\ \in \ p]
$$

$$
\begin{array}{l}
\operatorname{DirKey}(d,\ S)\ = \\[0.16em]
\ \langle \operatorname{FoldPath}(\mathsf{rel}),\ \mathsf{rel}\rangle \ \mathsf{if}\ \operatorname{relative}(d,\ S)\ \Downarrow \ \mathsf{rel} \\[0.16em]
\ \langle \bot ,\ \operatorname{Basename}(d)\rangle \quad \mathsf{if}\ \operatorname{relative}(d,\ S)\ \Uparrow
\end{array}
$$

$$
d_{1}\ \prec_{\mathsf{dir}} \ d_{2}\ \Leftrightarrow \ \operatorname{Utf8LexLess}(\operatorname{DirKey}(d_{1},\ S),\ \operatorname{DirKey}(d_{2},\ S))
$$

$$
\operatorname{DirSeq}(S)\ =\ \mathsf{sort}\_\{\prec_{\mathsf{dir}} \}(\operatorname{Dirs}(S))
$$

**(DirSeq-Read-Err)**

$$
\begin{array}{l}
\operatorname{Dirs}(S)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{DirSeq}-\mathsf{Read}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c)
\end{array}
$$

**(DirSeq-Rel-Fail)**

$$
\begin{array}{l}
\operatorname{relative}(d,\ S)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{DirSeq}-\mathsf{Rel}-\mathsf{Fail}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c)
\end{array}
$$
