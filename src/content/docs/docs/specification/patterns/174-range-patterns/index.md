---
title: "17.4 Range Patterns"
description: "17.4 Range Patterns from 17. Patterns of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "patterns"
specSection: "174-range-patterns"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/patterns/">17. Patterns</a>
  <span>Patterns</span>
</div>

## 17.4 Range Patterns

### 17.4.1 Syntax

```text
range_pattern ::= pattern (".." | "..=") pattern
```

### 17.4.2 Parsing

**(Parse-Pattern)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePatternRange}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat})
\end{array}
$$

**(Parse-Pattern-Err)**

$$
\begin{array}{l}
c\ =\ \operatorname{Code}(\mathsf{Parse}-\mathsf{Syntax}-\mathsf{Err})\quad \Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{Tok}(P).\mathsf{span}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P,\ \mathsf{WildcardPattern})
\end{array}
$$

**(Parse-Pattern-Range-None)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (P_{1},\ p)\quad \lnot \ (\operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{".."})\ \lor \ \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"..="})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePatternRange}(P)\ \Downarrow \ (P_{1},\ p)
\end{array}
$$

**(Parse-Pattern-Range)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (P_{1},\ p_{0})\quad \operatorname{Tok}(P_{1})\ =\ \mathsf{op}\ \in \ \{\texttt{".."},\ \texttt{"..="}\}\quad \Gamma \ \vdash \ \operatorname{ParsePatternAtom}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ p_{1})\quad \mathsf{kind}\ =\ (\texttt{Exclusive}\ \mathsf{if}\ \mathsf{op}\ =\ \texttt{".."}\ \mathsf{else}\ \texttt{Inclusive}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePatternRange}(P)\ \Downarrow \ (P_{2},\ \operatorname{RangePattern}(\mathsf{kind},\ p_{0},\ p_{1}))
\end{array}
$$

### 17.4.3 AST Representation / Form

RangePattern(kind, lo, hi)

$$
\operatorname{ConstPatInt}(p)\ =\ n\ \Leftrightarrow \ p\ =\ \operatorname{LiteralPattern}(\operatorname{IntLiteral}(n))
$$

### 17.4.4 Static Semantics

**(Pat-Range-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes}\quad \operatorname{ConstPatInt}(p_{l})\ =\ n_{l}\quad \operatorname{ConstPatInt}(p_{h})\ =\ n_{h}\quad (\mathsf{kind}\ =\ \texttt{".."}\ \Rightarrow \ n_{l}\ <\ n_{h})\quad (\mathsf{kind}\ =\ \texttt{"..="}\ \Rightarrow \ n_{l}\ \le \ n_{h}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RangePattern}(\mathsf{kind},\ p_{l},\ p_{h})\ \triangleleft \ T\ \dashv \ \emptyset
\end{array}
$$

**(RangePattern-NonConst)**

$$
\begin{array}{l}
(\operatorname{ConstPatInt}(p_{l})\ \mathsf{undefined}\ \lor \ \operatorname{ConstPatInt}(p_{h})\ \mathsf{undefined})\quad c\ =\ \operatorname{Code}(\mathsf{RangePattern}-\mathsf{NonConst}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RangePattern}(\mathsf{kind},\ p_{l},\ p_{h})\ \triangleleft \ T\ \Uparrow \ c
\end{array}
$$

**(RangePattern-Empty)**

$$
\begin{array}{l}
\operatorname{ConstPatInt}(p_{l})\ =\ n_{l}\quad \operatorname{ConstPatInt}(p_{h})\ =\ n_{h}\quad ((\mathsf{kind}\ =\ \texttt{".."})\ \Rightarrow \ n_{l}\ \ge \ n_{h})\quad ((\mathsf{kind}\ =\ \texttt{"..="})\ \Rightarrow \ n_{l}\ >\ n_{h})\quad c\ =\ \operatorname{Code}(\mathsf{RangePattern}-\mathsf{Empty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RangePattern}(\mathsf{kind},\ p_{l},\ p_{h})\ \triangleleft \ T\ \Uparrow \ c
\end{array}
$$

### 17.4.5 Dynamic Semantics

$$
\operatorname{ConstPat}(p)\ =\ v\ \Leftrightarrow \ p\ =\ \operatorname{LiteralPattern}(\ell )\ \land \ v\ =\ \operatorname{LiteralValue}(\ell ,\ \operatorname{PatType}(p))
$$

**(Match-Range)**

$$
\begin{array}{l}
\operatorname{ConstPat}(p_{l})\ =\ v_{l}\quad \operatorname{ConstPat}(p_{h})\ =\ v_{h}\quad v_{l}\ \le \ v\ \le \ v_{h} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(p_{l}\ \texttt{..=}\ p_{h},\ v)\ \Downarrow \ \emptyset
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ConstPat}(p_{l})\ =\ v_{l}\quad \operatorname{ConstPat}(p_{h})\ =\ v_{h}\quad v_{l}\ \le \ v\ <\ v_{h} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(p_{l}\ \texttt{..}\ p_{h},\ v)\ \Downarrow \ \emptyset
\end{array}
$$

### 17.4.6 Lowering

Range patterns use the shared lowering rules in §17.5.6.

### 17.4.7 Diagnostics

Diagnostics are defined for range-pattern bounds that are not compile-time constants and for statically empty ranges.
