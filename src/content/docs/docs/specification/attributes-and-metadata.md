---
title: "Attributes and Metadata"
description: "9. Attributes and Metadata of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T19:35:24.518Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>


## 9.1 Attribute Syntax and Placement

### 9.1.1 Syntax

```text
attribute_list    ::= attribute+
attribute         ::= "[[" attribute_spec ("," attribute_spec)* "]]"
attribute_spec    ::= attribute_name ("(" attribute_args ")")?
attribute_name    ::= identifier
                    | "dynamic"
                    | "static"
                    | vendor_prefix "::" identifier
                    | vendor_prefix "::" "dynamic"
                    | vendor_prefix "::" "static"
vendor_prefix     ::= identifier ("::" identifier)*
attribute_args    ::= attribute_arg ("," attribute_arg)* ","?
attribute_arg     ::= literal
                    | identifier
                    | identifier ":" literal
                    | identifier ":" identifier
                    | identifier "(" attribute_args ")"
```

The reserved names `dynamic` and `static` are admitted only in the leaf position of `attribute_name`. They MUST NOT appear inside `vendor_prefix`.

An attribute list MUST appear immediately before the declaration or expression it modifies.

### 9.1.2 Parsing

**(Parse-AttrListOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"[["}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-AttrListOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"[["})\quad \Gamma \ \vdash \ \operatorname{ParseAttrList}(P)\ \Downarrow \ (P_{1},\ \mathsf{attrs}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{attrs})
\end{array}
$$

**(Parse-AttrList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrBlock}(P)\ \Downarrow \ (P_{1},\ \mathsf{attrs}_{0})\quad \Gamma \ \vdash \ \operatorname{ParseAttrListTail}(P_{1},\ \mathsf{attrs}_{0})\ \Downarrow \ (P_{2},\ \mathsf{attrs}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrList}(P)\ \Downarrow \ (P_{2},\ \mathsf{attrs})
\end{array}
$$

**(Parse-AttrListTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"[["}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrListTail}(P,\ \mathsf{attrs})\ \Downarrow \ (P,\ \mathsf{attrs})
\end{array}
$$

**(Parse-AttrListTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"[["})\quad \Gamma \ \vdash \ \operatorname{ParseAttrBlock}(P)\ \Downarrow \ (P_{1},\ \mathsf{attrs}_{0})\quad \Gamma \ \vdash \ \operatorname{ParseAttrListTail}(P_{1},\ \mathsf{attrs}\ \mathbin{++} \ \mathsf{attrs}_{0})\ \Downarrow \ (P_{2},\ \mathsf{attrs}_{1}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrListTail}(P,\ \mathsf{attrs})\ \Downarrow \ (P_{2},\ \mathsf{attrs}_{1})
\end{array}
$$

**(Parse-AttrBlock)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"[["})\quad P_{0}\ =\ \operatorname{Advance}(P)\quad \Gamma \ \vdash \ \operatorname{ParseAttrSpecList}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{specs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"]]"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrBlock}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{specs})
\end{array}
$$

**(Parse-AttrSpecList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrSpec}(P)\ \Downarrow \ (P_{1},\ s)\quad \Gamma \ \vdash \ \operatorname{ParseAttrSpecListTail}(P_{1},\ [s])\ \Downarrow \ (P_{2},\ \mathsf{specs}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrSpecList}(P)\ \Downarrow \ (P_{2},\ \mathsf{specs})
\end{array}
$$

**(Parse-AttrSpecListTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrSpecListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-AttrSpecListTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"]]"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Punctuator}(\texttt{"]]"})\}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrSpecListTail}(P,\ \mathsf{xs})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{xs})
\end{array}
$$

**(Parse-AttrSpecListTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseAttrSpec}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ s)\quad \Gamma \ \vdash \ \operatorname{ParseAttrSpecListTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [s])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrSpecListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

**(Parse-AttrSpec)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrName}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseAttrArgsOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{args}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrSpec}(P)\ \Downarrow \ (P_{2},\ \operatorname{Attr}(\mathsf{name},\ \mathsf{args}))
\end{array}
$$

**(Parse-AttrArgsOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrArgsOpt}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-AttrArgsOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseAttrArgList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrArgsOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{args})
\end{array}
$$

**(Parse-AttrArgList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrArg}(P)\ \Downarrow \ (P_{1},\ a)\quad \Gamma \ \vdash \ \operatorname{ParseAttrArgListTail}(P_{1},\ [a])\ \Downarrow \ (P_{2},\ \mathsf{args}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrArgList}(P)\ \Downarrow \ (P_{2},\ \mathsf{args})
\end{array}
$$

**(Parse-AttrArgListTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrArgListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-AttrArgListTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{")"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Punctuator}(\texttt{")"})\}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrArgListTail}(P,\ \mathsf{xs})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{xs})
\end{array}
$$

**(Parse-AttrArgListTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseAttrArg}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ a)\quad \Gamma \ \vdash \ \operatorname{ParseAttrArgListTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [a])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrArgListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

**(Parse-AttrArg-Named-Literal)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{":"})\quad \operatorname{Tok}(\operatorname{Advance}(P_{1})).\mathsf{kind}\ \in \ \mathsf{LiteralKind} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrArg}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P_{1})),\ \langle \mathsf{name},\ \operatorname{Tok}(\operatorname{Advance}(P_{1}))\rangle )
\end{array}
$$

**(Parse-AttrArg-Named-Ident)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{value}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrArg}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{name},\ \mathsf{value}\rangle )
\end{array}
$$

**(Parse-AttrArg-Named-Call)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseAttrArgList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrArg}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \langle \mathsf{name},\ \mathsf{args}\rangle )
\end{array}
$$

**(Parse-AttrArg-Literal)**

$$
\begin{array}{l}
\operatorname{Tok}(P).\mathsf{kind}\ \in \ \mathsf{LiteralKind} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrArg}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Tok}(P))
\end{array}
$$

**(Parse-AttrArg-Ident)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrArg}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})
\end{array}
$$

### 9.1.3 AST Representation / Form

$$
\mathsf{AttrName}\ \mathbin{::} =\ \mathsf{identifier}
$$
           | "dynamic"
           | "static"
           | ⟨vendor_prefix, identifier⟩
           | ⟨vendor_prefix, "dynamic"⟩
           | ⟨vendor_prefix, "static"⟩

$$
\begin{array}{l}
\mathsf{vendor}_{\mathsf{prefix}}\ \mathbin{::} =\ \mathsf{identifier}\ (\texttt{"::"}\ \mathsf{identifier})* \\
\mathsf{AttrArg}\ \mathbin{::} =\ \mathsf{literal}\ \mid \ \mathsf{identifier}\ \mid \ \langle \mathsf{name},\ \mathsf{literal}\rangle \ \mid \ \langle \mathsf{name},\ \mathsf{identifier}\rangle \ \mid \ \langle \mathsf{name},\ \mathsf{args}\rangle  \\
\mathsf{AttributeSpec}\ \mathbin{::} =\ \operatorname{Attr}(\mathsf{name}:\ \mathsf{AttrName},\ \mathsf{args}:\ [\mathsf{AttrArg}]) \\
\mathsf{AttributeList}\ \mathbin{::} =\ [\mathsf{AttributeSpec}] \\
\mathsf{AttrOpt}\ \mathbin{::} =\ \{\bot \}\ \cup \ \mathsf{AttributeList}
\end{array}
$$

$$
\operatorname{ExprAttrs}(e)\ \in \ \mathsf{AttrOpt}
$$

$$
\operatorname{AttachExprAttrs}(e,\ \mathsf{attrs})\ =\ e'\ \mathsf{where}\ \operatorname{ExprAttrs}(e')\ =\ (\mathsf{attrs}\ \mathbin{++} \ \operatorname{ExprAttrs}(e)\ \mathsf{if}\ \operatorname{ExprAttrs}(e)\ \ne \ \bot \ \mathsf{else}\ \mathsf{attrs})\ \mathsf{and}\ \mathsf{all}\ \mathsf{other}\ \mathsf{fields}\ \mathsf{of}\ e'\ \mathsf{equal}\ \mathsf{those}\ \mathsf{of}\ e
$$

$$
\begin{array}{l}
\operatorname{AttrListOf}(\mathsf{item})\ =\ \mathsf{attrs}\quad \mathsf{if}\ \mathsf{item}.\mathsf{attrs}_{\mathsf{opt}}\ =\ \mathsf{attrs} \\
\operatorname{AttrListOf}(\mathsf{item})\ =\ []\quad \mathsf{if}\ \mathsf{item}.\mathsf{attrs}_{\mathsf{opt}}\ =\ \bot  \\
\operatorname{AttrByName}(\mathsf{item},\ n)\ =\ [a\ \mid \ a\ \in \ \operatorname{AttrListOf}(\mathsf{item})\ \land \ a.\mathsf{name}\ =\ n]
\end{array}
$$

### 9.1.4 Static Semantics

Malformed attribute syntax is ill-formed.

$$
\mathsf{AttrTarget}\ =\ \{\mathsf{Record},\ \mathsf{Enum},\ \mathsf{Modal},\ \mathsf{Procedure},\ \mathsf{Method},\ \mathsf{Field},\ \mathsf{Binding},\ \mathsf{Statement},\ \mathsf{Expression},\ \mathsf{KeyBlock},\ \mathsf{ExternBlock},\ \mathsf{TypeAlias}\}
$$

$$
\begin{array}{l}
\mathsf{AttrRegistry}\ =\ R_{\mathsf{spec}}\ \uplus \ R_{\mathsf{vendor}} \\
R_{\mathsf{vendor}}\ =\ \emptyset 
\end{array}
$$

$$
\begin{array}{l}
R_{\mathsf{spec}}\ =\ \{ \\
\ \mathsf{layout},\ \mathsf{inline},\ \mathsf{cold},\ \mathsf{deprecated}, \\
\ \mathsf{dynamic},\ \mathsf{stale}_{\mathsf{ok}}, \\
\ \mathsf{relaxed},\ \mathsf{acquire},\ \mathsf{release},\ \mathsf{acqrel},\ \mathsf{seqcst}, \\
\ \mathsf{static}, \\
\ \mathsf{mangle},\ \mathsf{library},\ \mathsf{unwind}, \\
\ \mathsf{reflect},\ \mathsf{derive},\ \mathsf{emit},\ \mathsf{files}, \\
\ \mathsf{export},\ \mathsf{host}_{\mathsf{export}},\ \mathsf{ffi}_{\mathsf{pass}\_\mathsf{by}\_\mathsf{value}}, \\
\ \mathsf{test} \\
\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AttrTargets}(\mathsf{layout})\ =\ \{\mathsf{Record},\ \mathsf{Enum}\} \\
\operatorname{AttrTargets}(\mathsf{inline})\ =\ \{\mathsf{Procedure},\ \mathsf{Method}\} \\
\operatorname{AttrTargets}(\mathsf{cold})\ =\ \{\mathsf{Procedure},\ \mathsf{Method}\} \\
\operatorname{AttrTargets}(\mathsf{deprecated})\ =\ \{\mathsf{Record},\ \mathsf{Enum},\ \mathsf{Modal},\ \mathsf{Procedure},\ \mathsf{Method},\ \mathsf{Field},\ \mathsf{Binding},\ \mathsf{TypeAlias}\} \\
\operatorname{AttrTargets}(\mathsf{dynamic})\ =\ \{\mathsf{Record},\ \mathsf{Enum},\ \mathsf{Modal},\ \mathsf{Procedure},\ \mathsf{Method},\ \mathsf{Expression}\} \\
\operatorname{AttrTargets}(\mathsf{stale}_{\mathsf{ok}})\ =\ \{\mathsf{Binding}\} \\
\operatorname{AttrTargets}(\mathsf{relaxed})\ =\ \{\mathsf{Expression},\ \mathsf{KeyBlock}\} \\
\operatorname{AttrTargets}(\mathsf{acquire})\ =\ \{\mathsf{Expression},\ \mathsf{KeyBlock}\} \\
\operatorname{AttrTargets}(\mathsf{release})\ =\ \{\mathsf{Expression},\ \mathsf{KeyBlock}\} \\
\operatorname{AttrTargets}(\mathsf{acqrel})\ =\ \{\mathsf{Expression},\ \mathsf{KeyBlock}\} \\
\operatorname{AttrTargets}(\mathsf{seqcst})\ =\ \{\mathsf{Expression},\ \mathsf{KeyBlock}\} \\
\operatorname{AttrTargets}(\mathsf{static})\ =\ \{\mathsf{Procedure}\} \\
\operatorname{AttrTargets}(\mathsf{mangle})\ =\ \{\mathsf{Procedure}\} \\
\operatorname{AttrTargets}(\mathsf{library})\ =\ \{\mathsf{ExternBlock}\} \\
\operatorname{AttrTargets}(\mathsf{unwind})\ =\ \{\mathsf{Procedure}\} \\
\operatorname{AttrTargets}(\mathsf{reflect})\ =\ \{\mathsf{Record},\ \mathsf{Enum},\ \mathsf{Modal}\} \\
\operatorname{AttrTargets}(\mathsf{derive})\ =\ \{\mathsf{Record},\ \mathsf{Enum},\ \mathsf{Modal}\} \\
\operatorname{AttrTargets}(\mathsf{emit})\ =\ \{\mathsf{Statement},\ \mathsf{Expression}\} \\
\operatorname{AttrTargets}(\mathsf{files})\ =\ \{\mathsf{Statement},\ \mathsf{Expression}\} \\
\operatorname{AttrTargets}(\mathsf{export})\ =\ \{\mathsf{Procedure}\} \\
\operatorname{AttrTargets}(\mathsf{host}_{\mathsf{export}})\ =\ \{\mathsf{Procedure}\} \\
\operatorname{AttrTargets}(\mathsf{ffi}_{\mathsf{pass}\_\mathsf{by}\_\mathsf{value}})\ =\ \{\mathsf{Record},\ \mathsf{Enum}\} \\
\operatorname{AttrTargets}(\mathsf{test})\ =\ \{\mathsf{Procedure}\}
\end{array}
$$

$$
\mathsf{AttrListJudg}\ =\ \{\mathsf{AttrListWf}\}
$$

**(AttrList-Ok)**

$$
\begin{array}{l}
A\ =\ [a_{1},\ \ldots ,\ a_{n}]\quad \forall \ i,\ a_{i}\ =\ \langle \mathsf{name}_{i},\ \mathsf{args}_{i}\rangle \quad \forall \ i,\ \mathsf{name}_{i}\ \in \ R_{\mathsf{spec}}\ \cup \ R_{\mathsf{vendor}}\quad \forall \ i,\ \tau \ \in \ \operatorname{AttrTargets}(\mathsf{name}_{i})\quad \forall \ i,\ \operatorname{AttrArgsOk}(\mathsf{name}_{i},\ \mathsf{args}_{i}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{AttrListWf}(A,\ \tau )\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(AttrList-Unknown)**

$$
\begin{array}{l}
A\ =\ [a_{1},\ \ldots ,\ a_{n}]\quad \exists \ i,\ a_{i}\ =\ \langle \mathsf{name}_{i},\ \_\rangle \ \land \ \mathsf{name}_{i}\ \notin \ R_{\mathsf{spec}}\ \cup \ R_{\mathsf{vendor}} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{AttrListWf}(A,\ \tau )\ \Uparrow \ c\quad c\ =\ \operatorname{Code}(\mathsf{Attr}-\mathsf{Unknown})
\end{array}
$$

**(AttrList-Target-Err)**

$$
\begin{array}{l}
A\ =\ [a_{1},\ \ldots ,\ a_{n}]\quad \exists \ i,\ a_{i}\ =\ \langle \mathsf{name}_{i},\ \_\rangle \ \land \ \mathsf{name}_{i}\ \in \ R_{\mathsf{spec}}\ \cup \ R_{\mathsf{vendor}}\ \land \ \tau \ \notin \ \operatorname{AttrTargets}(\mathsf{name}_{i}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{AttrListWf}(A,\ \tau )\ \Uparrow \ c\quad c\ =\ \operatorname{Code}(\mathsf{Attr}-\mathsf{Target}-\mathsf{Err})
\end{array}
$$

$$
\operatorname{AttrArgsOk}(\mathsf{name},\ \mathsf{args})\ \Leftrightarrow \ \mathsf{args}\ \mathsf{satisfy}\ \mathsf{the}\ \mathsf{attribute}-\mathsf{specific}\ \mathsf{grammar}\ \mathsf{and}\ \mathsf{constraints}\ \mathsf{in}\ \S \S 9.3- 9.6,\ \S 19.7,\ \S 23.4,\ \mathsf{and}\ \S 23.6,\ \mathsf{or}\ \mathsf{the}\ \mathsf{vendor}-\mathsf{defined}\ \mathsf{schema}\ \mathsf{for}\ \mathsf{name}\ \in \ R_{\mathsf{vendor}}.
$$

Memory-order attributes are well-formed only when attached to key blocks or expressions that contain key acquisition.

$$
\mathsf{For}\ \mathsf{every}\ \mathsf{declaration}\ \mathsf{or}\ \mathsf{expression}\ \mathsf{with}\ \mathsf{an}\ \mathsf{attribute}\ \mathsf{list}\ A\ \mathsf{and}\ \mathsf{target}\ \mathsf{kind}\ \tau ,\ \mathsf{the}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{check}\ \Gamma \ \vdash \ \operatorname{AttrListWf}(A,\ \tau )\ \Downarrow \ \mathsf{ok}.
$$

Multiple attribute lists on the same target are equivalent to a single list with concatenated entries in source order. Attribute application order is left-to-right in that concatenated list.

FFI-specific attributes `mangle`, `library`, `unwind`, `export`, `host_export`, and `ffi_pass_by_value` are defined by §23.4.

### 9.1.5 Dynamic Semantics

Attribute lists do not evaluate to runtime values. Runtime effects, when any, are defined by the owning attribute families in §§9.3–9.6, §19.7, and §23.

### 9.1.6 Lowering

This section introduces no direct lowering. Lowering consequences of specific attributes are defined by the owning sections.

### 9.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                      |
| ------------ | -------- | ------------ | ---------------------------------------------- |
| `E-MOD-2450` | Error    | Compile-time | Malformed attribute syntax                     |
| `E-MOD-2451` | Error    | Compile-time | Unknown attribute name                         |
| `E-MOD-2452` | Error    | Compile-time | Attribute not valid on target declaration kind |

## 9.2 Vendor Attributes

### 9.2.1 Syntax

This section introduces no additional concrete syntax beyond the scoped `attribute_name` form defined by §9.1.1.

### 9.2.2 Parsing

Vendor-qualified attribute names reuse the general attribute parser with the vendor-name delta below.

$$
\operatorname{AttrLeafTok}(\mathsf{tok},\ \mathsf{id})\ \Leftrightarrow \ \mathsf{tok}\ =\ \operatorname{Identifier}(\mathsf{id})\ \lor \ (\mathsf{tok}\ =\ \operatorname{Keyword}(\mathsf{kw})\ \land \ \mathsf{kw}\ \in \ \{\texttt{dynamic},\ \texttt{static}\}\ \land \ \mathsf{id}\ =\ \mathsf{kw})
$$

**(Parse-AttrName-Plain)**

$$
\begin{array}{l}
\operatorname{AttrLeafTok}(\operatorname{Tok}(P),\ \mathsf{id})\quad P_{1}\ =\ \operatorname{Advance}(P)\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"."})\quad \lnot \ \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"::"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrName}(P)\ \Downarrow \ (P_{1},\ \mathsf{id})
\end{array}
$$

**(Parse-AttrName-Vendor)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{id}_{0})\quad \Gamma \ \vdash \ \operatorname{ParseVendorPrefixTail}(P_{1},\ [\mathsf{id}_{0}])\ \Downarrow \ (P_{2},\ \mathsf{pref})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{2}),\ \texttt{"::"})\quad \operatorname{AttrLeafTok}(\operatorname{Tok}(\operatorname{Advance}(P_{2})),\ \mathsf{name})\quad P_{3}\ =\ \operatorname{Advance}(\operatorname{Advance}(P_{2})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseAttrName}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{pref},\ \mathsf{name}\rangle )
\end{array}
$$

**(Parse-VendorPrefixTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"::"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseVendorPrefixTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-VendorPrefixTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"::"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{id})\quad \Gamma \ \vdash \ \operatorname{ParseVendorPrefixTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [\mathsf{id}])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseVendorPrefixTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

### 9.2.3 AST Representation / Form

$$
\mathsf{Vendor}-\mathsf{defined}\ \mathsf{attribute}\ \mathsf{names}\ \mathsf{use}\ \mathsf{the}\ \mathsf{scoped}\ \texttt{AttrName}\ \mathsf{form}\ \texttt{<vendor\_prefix, leaf>},\ \mathsf{where}\ \texttt{leaf}\ \mathsf{is}\ \mathsf{an}\ \texttt{identifier}\ \mathsf{or}\ \mathsf{one}\ \mathsf{of}\ \mathsf{the}\ \mathsf{reserved}\ \mathsf{verification}-\mathsf{mode}\ \mathsf{names}\ \texttt{dynamic}\ \mathsf{or}\ \texttt{static}.\ \texttt{vendor\_prefix}\ \mathsf{segments}\ \mathsf{are}\ \mathsf{always}\ \texttt{identifier}\ \mathsf{tokens}.
$$

### 9.2.4 Static Semantics

$$
\mathsf{Vendor}-\mathsf{defined}\ \mathsf{attributes}\ \mathsf{in}\ \texttt{R\_vendor}\ \mathsf{MUST}\ \mathsf{use}\ \mathsf{scoped}\ \mathsf{prefixes}\ \mathsf{of}\ \mathsf{the}\ \mathsf{form}\ \texttt{vendor::name}\ \mathsf{or}\ \texttt{com::vendor::name}.
$$

$$
\mathsf{The}\ \texttt{ultraviolet::...}\ \mathsf{namespace}\ \mathsf{is}\ \mathsf{reserved}\ \mathsf{for}\ \mathsf{specification}-\mathsf{defined}\ \mathsf{attributes}.
$$

$$
\texttt{R\_vendor = emptyset}.\ \mathsf{Any}\ \mathsf{attribute}\ \mathsf{name}\ \mathsf{not}\ \mathsf{in}\ \texttt{R\_spec}\ \mathsf{is}\ \mathsf{rejected}\ \mathsf{as}\ \mathsf{unknown}.
$$

### 9.2.5 Dynamic Semantics

This section introduces no additional runtime mechanism.

### 9.2.6 Lowering

This section introduces no additional lowering rules.

### 9.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                               |
| ------------ | -------- | ------------ | ------------------------------------------------------- |
| `E-CNF-0402` | Error    | Compile-time | Reserved namespace `ultraviolet::...` used by user code |

Unknown attribute-name rejection is owned by §9.1.7.

## 9.3 Layout Attributes

### 9.3.1 Syntax

```text
layout_attribute ::= "[[" "layout" "(" layout_args ")" "]]"
layout_args      ::= layout_kind ("," layout_kind)*
layout_kind      ::= "C" | "packed" | "align" "(" integer_literal ")" | int_type
int_type         ::= "i8" | "i16" | "i32" | "i64" | "u8" | "u16" | "u32" | "u64"
```

### 9.3.2 Parsing

Layout attributes are parsed by the general attribute parser in §9.1.2. This section introduces no additional parsing rules.

### 9.3.3 AST Representation / Form

Layout attributes are ordinary `AttributeSpec` entries attached to `RecordDecl` or `EnumDecl`.

### 9.3.4 Static Semantics

$$
**\texttt{[[layout(C)]]}.**\ \mathsf{Specifies}\ C-\mathsf{compatible}\ \mathsf{memory}\ \mathsf{layout}.
$$

For `record` declarations:
1. Fields MUST be laid out in declaration order.
2. Padding MUST be inserted only as required by the target platform's C ABI.
3. Total size MUST be a multiple of the record's alignment.

For `enum` declarations:
1. The discriminant MUST be represented as a C-compatible integer tag.
2. Default tag type is `DiscType(E)` as defined by §12.7.
3. Layout MUST conform to a tagged union per the target C ABI.

$$
**\texttt{[[layout(IntType)]]}\ (\mathsf{explicit}\ \mathsf{discriminant}).**\ \mathsf{For}\ \mathsf{an}\ \texttt{enum}\ \mathsf{marked}\ \texttt{[[layout(IntType)]]}\ \mathsf{where}\ \texttt{IntType}\ \mathsf{is}\ \texttt{i8}- \texttt{i64}\ \mathsf{or}\ \texttt{u8}- \texttt{u64}:
$$
1. The discriminant MUST use the specified integer type.
2. Each variant's discriminant value MUST be representable in that type.
3. This form is valid only on `enum` declarations.

$$
**\texttt{[[layout(packed)]]}.**\ \mathsf{Removes}\ \mathsf{inter}-\mathsf{field}\ \mathsf{padding}.
$$

$$
\mathsf{For}\ a\ \texttt{record}\ \mathsf{marked}\ \texttt{[[layout(packed)]]}:
$$
1. All inter-field padding is removed.
2. Each field MUST be laid out with alignment 1.
3. The record's overall alignment becomes 1.

Taking a reference to a packed field MUST occur within an `unsafe` block. Outside `unsafe`, the program is ill-formed.

$$
**\texttt{[[layout(align(N))]]}.**\ \mathsf{Sets}\ a\ \mathsf{minimum}\ \mathsf{alignment}.
$$

1. N MUST be a positive integer that is a power of two.
2. Effective alignment is max(N, natural alignment).
3. If N < natural alignment, natural alignment is used.
4. Type size is padded to a multiple of the effective alignment.

**Compile-time layout verification**

Valid combinations:
- `layout(C)`
- `layout(packed)`
- `layout(align(N))`
- `layout(C, packed)`
- `layout(C, align(N))`
- `layout(u8)`

Invalid combinations:
- `layout(packed, align(N))`

Applicability constraints:
- `record`: `C`, `packed`, `align(N)`
- `enum`: `C`, `align(N)`, `IntType`
- `modal`: none
- generic (unmonomorphized): none

Constraints:
1. `layout(packed)` applied to a non-`record` declaration is ill-formed.
2. `layout(align(N))` where N is not a power of two is ill-formed.
3. Conflicting layout arguments, including `layout(packed, align(N))`, are ill-formed.
4. `layout(align(N))` where N < natural alignment emits a warning.

### 9.3.5 Dynamic Semantics

Layout attributes introduce no direct runtime mechanism. Packed-field reference safety is enforced statically at the use site.

### 9.3.6 Lowering

Layout attributes constrain the layout and ABI calculations used by Chapter 24. `layout(C)` selects target C-ABI layout, `layout(packed)` removes inter-field padding and lowers effective alignment to 1, `layout(align(N))` raises minimum alignment, and `layout(IntType)` selects the enum discriminant representation.

### 9.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                  |
| ------------ | -------- | ------------ | ------------------------------------------ |
| `E-MOD-2453` | Error    | Compile-time | `align(N)` where N is not a power of two   |
| `E-MOD-2454` | Error    | Compile-time | `packed` applied to non-record             |
| `E-MOD-2455` | Error    | Compile-time | Conflicting layout arguments               |
| `E-TYP-2105` | Error    | Compile-time | Reference to packed field outside `unsafe` |
| `W-MOD-2451` | Warning  | Compile-time | `align(N)` where N < natural alignment     |

## 9.4 Optimization Attributes

### 9.4.1 Syntax

```text
inline_attribute ::= "[[" "inline" ("(" inline_mode ")")? "]]"
inline_mode      ::= "always" | "never" | "default"

cold_attribute   ::= "[[" "cold" "]]"
```

### 9.4.2 Parsing

Optimization attributes are parsed by the general attribute parser in §9.1.2. This section introduces no additional parsing rules.

### 9.4.3 AST Representation / Form

Optimization attributes are ordinary `AttributeSpec` entries attached to `ProcedureDecl` or `MethodDecl`.

### 9.4.4 Static Semantics

**`[[inline]]`.** The implementation SHOULD inline the procedure at call sites when feasible.

$$
**\texttt{[[inline(always)]]}.**\ \mathsf{The}\ \mathsf{implementation}\ \mathsf{SHOULD}\ \mathsf{inline}\ \mathsf{the}\ \mathsf{procedure}\ \mathsf{at}\ \mathsf{all}\ \mathsf{call}\ \mathsf{sites}.\ \mathsf{If}\ \mathsf{inlining}\ \mathsf{is}\ \mathsf{not}\ \mathsf{possible},\ \mathsf{such}\ \mathsf{as}\ \mathsf{for}\ \mathsf{reultraviolet}\ \mathsf{procedures}\ \mathsf{or}\ \mathsf{procedures}\ \mathsf{whose}\ \mathsf{address}\ \mathsf{is}\ \mathsf{taken},\ \mathsf{the}\ \mathsf{implementation}\ \mathsf{SHOULD}\ \mathsf{emit}\ a\ \mathsf{warning}.
$$

$$
**\texttt{[[inline(default)]]}.**\ \mathsf{Equivalent}\ \mathsf{to}\ \mathsf{omitting}\ \mathsf{the}\ \mathsf{attribute}.
$$

$$
**\texttt{[[inline(never)]]}.**\ \mathsf{The}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{NOT}\ \mathsf{inline}\ \mathsf{the}\ \mathsf{procedure}.\ \mathsf{The}\ \mathsf{procedure}\ \mathsf{body}\ \mathsf{MUST}\ \mathsf{be}\ \mathsf{emitted}\ \mathsf{as}\ a\ \mathsf{separate}\ \mathsf{callable}\ \mathsf{unit}.
$$

**`[[cold]]`.** Marks a procedure as unlikely to execute during typical runs. The implementation MAY use this as an optimization hint.

### 9.4.5 Dynamic Semantics

Optimization attributes do not change the language-level runtime semantics of the annotated procedure.

### 9.4.6 Lowering

$$
\texttt{[[inline(always)]]}\ \mathsf{and}\ \texttt{[[inline(never)]]}\ \mathsf{constrain}\ \mathsf{procedure}\ \mathsf{inlining}\ \mathsf{decisions}\ \mathsf{during}\ \mathsf{lowering}.\ \texttt{[[inline(never)]]}\ \mathsf{requires}\ \mathsf{emission}\ \mathsf{of}\ a\ \mathsf{separate}\ \mathsf{callable}\ \mathsf{unit}.\ \texttt{[[cold]]}\ \mathsf{MAY}\ \mathsf{influence}\ \mathsf{code}\ \mathsf{layout}\ \mathsf{or}\ \mathsf{backend}\ \mathsf{optimization}\ \mathsf{heuristics}.
$$

### 9.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                            |
| ------------ | -------- | ------------ | ------------------------------------ |
| `W-MOD-2452` | Warning  | Compile-time | `inline(always)` but inlining failed |

## 9.5 Diagnostics and Metadata Attributes

### 9.5.1 Syntax

All attributes in this section use the general attribute syntax from §9.1.1.

### 9.5.2 Parsing

These attributes are parsed by the general attribute parser in §9.1.2.

### 9.5.3 AST Representation / Form

$$
\begin{array}{l}
\operatorname{ExprAttrList}(e)\ =\ A\quad \mathsf{if}\ \operatorname{ExprAttrs}(e)\ =\ A \\
\operatorname{ExprAttrList}(e)\ =\ []\ \mathsf{if}\ \operatorname{ExprAttrs}(e)\ =\ \bot  \\
\operatorname{ExprAttrByName}(e,\ n)\ =\ [a\ \mid \ a\ \in \ \operatorname{ExprAttrList}(e)\ \land \ a.\mathsf{name}\ =\ n]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DynamicDecl}(d)\ \Leftrightarrow \ \operatorname{AttrByName}(d,\ \texttt{"dynamic"})\ \ne \ [] \\
\operatorname{DynamicExpr}(e)\ \Leftrightarrow \ \operatorname{ExprAttrByName}(e,\ \texttt{"dynamic"})\ \ne \ [] \\
\operatorname{DynamicScope}(s)\ \Leftrightarrow \ (\exists \ d.\ \operatorname{DynamicDecl}(d)\ \land \ s\ \subseteq \ d.\mathsf{span})\ \lor \ (\exists \ e.\ \operatorname{DynamicExpr}(e)\ \land \ s\ \subseteq \ \operatorname{ExprSpan}(e)) \\
\mathsf{InDynamicContext}\ \Leftrightarrow \ \operatorname{DynamicScope}(s)\ \mathsf{where}\ s\ \mathsf{is}\ \mathsf{the}\ \mathsf{span}\ \mathsf{of}\ \mathsf{the}\ \mathsf{syntactic}\ \mathsf{form}\ \mathsf{currently}\ \mathsf{being}\ \mathsf{verified}\ \mathsf{or}\ \mathsf{type}-\mathsf{checked}.
\end{array}
$$

### 9.5.4 Static Semantics

**`[[deprecated]]`.** Marks a declaration as deprecated. When referenced, the implementation MUST emit a deprecation warning. If a message argument is present, the diagnostic SHOULD include it.

**`[[dynamic]]`.** Marks a declaration or expression as requiring runtime verification when static verification is insufficient.

Scope determination:
1. `e` is within a `[[dynamic]]` scope if it is enclosed by a `[[dynamic]]` declaration, or by an attributed expression.
2. Scope is lexical and does not propagate through procedure calls.

$$
\mathsf{ComputeDynamicContext}\ :\ \mathsf{Span}\ \times \ \mathsf{AncestorList}\ \to \ \mathsf{Bool}
$$

$$
\begin{array}{l}
\operatorname{ComputeDynamicContext}(s,\ \mathsf{ancestors})\ = \\
\ \mathsf{let}\ \mathsf{enclosing}_{\mathsf{dynamic}}\ =\ \operatorname{FindInnermostDynamic}(s,\ \mathsf{ancestors}) \\
\ \mathsf{match}\ \mathsf{enclosing}_{\mathsf{dynamic}}\ \{ \\
\quad \bot \quad \to \ \mathsf{false} \\
\quad \operatorname{Some}(\_)\quad \to \ \mathsf{true} \\
\ \}
\end{array}
$$

$$
\mathsf{FindInnermostDynamic}\ :\ \mathsf{Span}\ \times \ \mathsf{AncestorList}\ \to \ \mathsf{Option}<\mathsf{Span}>
$$

$$
\begin{array}{l}
\operatorname{FindInnermostDynamic}(s,\ \mathsf{ancestors})\ = \\
\ \mathsf{let}\ \mathsf{dynamic}_{\mathsf{ancestors}}\ =\ [a\ \mid \ a\ \in \ \mathsf{ancestors}\ \land \ (\operatorname{DynamicDecl}(a)\ \lor \ \operatorname{DynamicExpr}(a))\ \land \ s\ \subseteq \ a.\mathsf{span}] \\
\ \mathsf{if}\ \mathsf{dynamic}_{\mathsf{ancestors}}\ =\ []\ \mathsf{then}\ \bot  \\
\ \mathsf{else}\ \operatorname{Some}(\operatorname{MinimalSpan}(\mathsf{dynamic}_{\mathsf{ancestors}}))
\end{array}
$$

$$
\mathsf{MinimalSpan}\ :\ [\mathsf{SyntacticForm}]\ \to \ \mathsf{Span}
$$

$$
\operatorname{MinimalSpan}(\mathsf{forms})\ =\ \mathsf{argmin}\_\{f\ \in \ \mathsf{forms}\}\ \mid f.\mathsf{span}\mid 
$$

**(DynamicContext-Override)**

$$
\begin{array}{l}
\operatorname{ClassProc}(C,\ m)\ \mathsf{has}\ [[\mathsf{dynamic}]]\quad \operatorname{ClassImpl}(T,\ C)\ \mathsf{has}\ \mathsf{override}\ m \\
\rule{18em}{0.4pt} \\
\operatorname{ComputeDynamicContext}(\mathsf{override}.\mathsf{body}.\mathsf{span},\ \operatorname{Ancestors}(\mathsf{override}))\ =\ \mathsf{true}
\end{array}
$$

A class procedure's `[[dynamic]]` annotation propagates to implementations.

**(DynamicContext-NoInherit-Call)**

$$
\begin{array}{l}
\operatorname{CallExpr}(f,\ \mathsf{args})\ \mathsf{at}\ \mathsf{span}\ s\quad f\ \mathsf{is}\ [[\mathsf{dynamic}]]\quad s\ \nsubseteq \ f.\mathsf{span} \\
\rule{18em}{0.4pt} \\
\operatorname{ComputeDynamicContext}(s,\ \operatorname{Ancestors}(s))\ \mathsf{does}\ \mathsf{not}\ \mathsf{consider}\ f's\ [[\mathsf{dynamic}]]
\end{array}
$$

`[[dynamic]]` scope is lexical and does not propagate through procedure calls.

Effects:
- Key system: runtime synchronization MUST be inserted exactly in the cases required by Chapter 19 and MUST NOT be inserted otherwise.
- Contracts: runtime checks MUST be inserted exactly in the cases required by §15.8 and MUST NOT be inserted otherwise.
- Refinement types: runtime checks MUST be inserted exactly in the cases required by §14.8 and MUST NOT be inserted otherwise.

Dynamic target restrictions:
1. `[[dynamic]]` applied to a contract predicate expression is ill-formed.
2. `[[dynamic]]` applied to a `type` alias declaration is ill-formed.
3. `[[dynamic]]` applied to a field declaration is ill-formed.

If a `[[dynamic]]` scope results in no runtime checks or runtime synchronization, the implementation SHOULD emit a warning.

**`[[stale_ok]]`.** Suppresses staleness warnings for bindings derived from `shared` data across `release` or `yield release` boundaries. Valid only on `let` and `var` bindings. See Chapters 19 and 21.

**Verification-mode attributes.** `[[static]]` is interpreted only in foreign-contract contexts. Semantics are defined by §23.6. `[[dynamic]]` reuses the dynamic verification mode defined above.

**`[[reflect]]`.** Marks a `record`, `enum`, or `modal` declaration as reflectable during Phase 2. Reflection queries over such declarations are defined by §22.3. A conforming implementation MUST expose the declaration's canonical shape, member order, and attached attributes to the compile-time reflection environment.

$$
**\texttt{[[derive(... )]]}.**\ \mathsf{Schedules}\ \mathsf{derive}-\mathsf{target}\ \mathsf{execution}\ \mathsf{in}\ \mathsf{Phase}\ 2\ \mathsf{for}\ \mathsf{the}\ \mathsf{annotated}\ \texttt{record},\ \texttt{enum},\ \mathsf{or}\ \texttt{modal}\ \mathsf{declaration}.\ \mathsf{Derive}\ \mathsf{target}\ \mathsf{resolution},\ \mathsf{dependency}\ \mathsf{ordering},\ \mathsf{and}\ \mathsf{contract}\ \mathsf{checking}\ \mathsf{are}\ \mathsf{defined}\ \mathsf{by}\ \S 22.5.
$$

**`[[emit]]`.** Grants the `TypeEmitter` capability to the annotated compile-time statement or compile-time expression. The target MUST be a `comptime` form. Emission ordering and generated-item visibility are defined by §22.4.

**`[[files]]`.** Grants the `ProjectFiles` capability to the annotated compile-time statement or compile-time expression. The target MUST be a `comptime` form. File snapshot and path-confinement semantics are defined by §22.2.

### 9.5.5 Dynamic Semantics

`[[deprecated]]`, `[[stale_ok]]`, and `[[static]]` introduce no direct runtime behavior in this chapter.

For `[[dynamic]]`, runtime synchronization or runtime verification MUST be inserted exactly when required by the owning chapters for keys, contracts, refinements, and foreign contracts, and MUST NOT be inserted otherwise.

### 9.5.6 Lowering

$$
\texttt{[[dynamic]]}\ \mathsf{lowers}\ \mathsf{by}\ \mathsf{enabling}\ \mathsf{runtime}\ \mathsf{synchronization}\ \mathsf{or}\ \mathsf{runtime}\ \mathsf{checks}\ \mathsf{exactly}\ \mathsf{where}\ \mathsf{the}\ \mathsf{owning}\ \mathsf{semantic}\ \mathsf{sections}\ \mathsf{require}\ \mathsf{them}\ \mathsf{and}\ \mathsf{nowhere}\ \mathsf{else}.\ \texttt{[[stale\_ok]]}\ \mathsf{suppresses}\ \mathsf{warnings}\ \mathsf{only}\ \mathsf{and}\ \mathsf{does}\ \mathsf{not}\ \mathsf{affect}\ \mathsf{lowering}.\ \texttt{[[deprecated]]}\ \mathsf{introduces}\ \mathsf{no}\ \mathsf{lowering}.\ \texttt{[[reflect]]},\ \texttt{[[derive(... )]]},\ \texttt{[[emit]]},\ \mathsf{and}\ \texttt{[[files]]}\ \mathsf{lower}\ \mathsf{only}\ \mathsf{through}\ \mathsf{Phase}\ 2\ \mathsf{execution}\ \mathsf{as}\ \mathsf{defined}\ \mathsf{by}\ \mathsf{Chapter}\ 22\ \mathsf{and}\ \mathsf{MUST}\ \mathsf{introduce}\ \mathsf{no}\ \mathsf{direct}\ \mathsf{Phase}\ 4\ \mathsf{runtime}\ \mathsf{instrumentation}.
$$

### 9.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                               |
| ------------ | -------- | ------------ | ------------------------------------------------------- |
| `W-CNF-0601` | Warning  | Compile-time | Reference to declaration marked `[[deprecated]]`        |
| `E-CON-0410` | Error    | Compile-time | `[[dynamic]]` applied to contract clause directly       |
| `E-CON-0411` | Error    | Compile-time | `[[dynamic]]` applied to type alias declaration         |
| `E-CON-0412` | Error    | Compile-time | `[[dynamic]]` applied to field declaration              |
| `W-CON-0401` | Warning  | Compile-time | `[[dynamic]]` present but all proofs succeed statically |

## 9.6 Source-Native Test Attributes

### 9.6.1 Syntax

```text
test_attribute      ::= "[[" "test" ("(" test_attribute_args ")")? "]]"
test_attribute_args ::= test_attribute_arg ("," test_attribute_arg)*
test_attribute_arg  ::= "name" ":" string_literal
                      | "covers" "(" string_literal ")"
```

### 9.6.2 Parsing

`[[test]]` is parsed by the ordinary attribute parser from §9.1.2. The `name`

$$
\begin{array}{l}
\mathsf{argument}\ \mathsf{is}\ \mathsf{represented}\ \mathsf{as}\ \texttt{<name, string\_literal>}.\ \mathsf{Each}\ \texttt{covers(...)}\ \mathsf{argument} \\
\mathsf{is}\ \mathsf{represented}\ \mathsf{as}\ \texttt{<covers, [string\_literal]>}.
\end{array}
$$

### 9.6.3 AST Representation / Form

A source-native test is an ordinary `ProcedureDecl` whose `AttrByName(proc,
test)` set is non-empty.

$$
\begin{array}{l}
\operatorname{TestName}(\mathsf{proc})\ =\ s\ \mathsf{when}\ \mathsf{the}\ \mathsf{unique}\ \texttt{name: s}\ \mathsf{argument}\ \mathsf{is}\ \mathsf{present}. \\
\operatorname{TestName}(\mathsf{proc})\ =\ \operatorname{FullyQualifiedProcPath}(\mathsf{proc})\ \mathsf{when}\ \mathsf{no}\ \texttt{name}\ \mathsf{argument}\ \mathsf{is}\ \mathsf{present}.
\end{array}
$$

$$
\operatorname{TestCoverage}(\mathsf{proc})\ =\ [r_{1},\ \ldots ,\ r_{n}]\ \mathsf{where}\ \mathsf{each}\ r_{i}\ \mathsf{is}\ \mathsf{the}\ \mathsf{string}\ \mathsf{argument}\ \mathsf{of}\ \mathsf{one}
$$
`covers(r_i)` entry in source order.

### 9.6.4 Static Semantics

`[[test]]` is valid only on ordinary source procedures.

$$
\texttt{AttrArgsOk(test, args)}\ \mathsf{holds}\ \mathsf{exactly}\ \mathsf{when}:
$$

1. every argument is either `name: string_literal` or `covers(string_literal)`;
2. at most one `name` argument is present;
3. every `covers` argument has exactly one non-empty string literal argument;
4. every coverage reference names one row in the obligation ledger using
   `obligation-id@Linternal_spec_line`.

A `[[test]]` procedure MUST:

1. have a body;
2. be non-generic;
3. have explicit visibility;
4. have an explicit return type;
5. have a contract clause containing a postcondition;
6. have either no parameters or exactly one parameter whose type is the
   toolchain-provided `TestContext` type.

The `TestContext` parameter is the only runner-injected value. It carries the
filesystem, process, temporary-directory, target-profile, and compiler-invocation
authority needed by effectful compiler tests.

### 9.6.5 Dynamic Semantics

`[[test]]` does not change ordinary procedure execution. During test execution,
the runner calls each discovered test procedure. A test passes when the procedure
returns normally and its postcondition is satisfied. A test fails when the
procedure returns normally and its postcondition is violated. A test errors when
the procedure is ill-formed for test execution, panics, requires unavailable
authority, or cannot be invoked by the generated harness.

### 9.6.6 Lowering

`[[test]]` does not lower into production program artifacts.

$$
\mathsf{TestArg}\ =\ \bot \ \mid \ s\ \mathsf{where}\ s\ \mathsf{is}\ \mathsf{the}\ \mathsf{optional}\ \mathsf{positional}\ \mathsf{argument}\ \mathsf{to}\ \texttt{uv test}.
$$

$$
\operatorname{HostPath}(s)\ \Leftrightarrow \ \operatorname{ResolveHostPath}(\mathsf{CurrentDirectory},\ s)\ \Downarrow \ p\ \land \ \operatorname{exists}(p)
$$

$$
\begin{array}{l}
\operatorname{TestInput}(\bot )\ =\ \mathsf{CurrentDirectory} \\
\operatorname{TestInput}(s)\ =\ p\ \mathsf{if}\ \operatorname{HostPath}(s)\ \land \ \operatorname{ResolveHostPath}(\mathsf{CurrentDirectory},\ s)\ \Downarrow \ p \\
\operatorname{TestInput}(s)\ =\ \mathsf{CurrentDirectory}\ \mathsf{if}\ \lnot \ \operatorname{HostPath}(s)
\end{array}
$$

$$
\operatorname{TestRoot}(\mathsf{arg})\ =\ \operatorname{FindProjectRoot}(\operatorname{TestInput}(\mathsf{arg}))
$$

$$
\begin{array}{l}
\operatorname{TestsPrefix}(A)\ =\ A.\mathsf{name}\ \mathbin{::} \ \texttt{Tests} \\
\operatorname{TestBearing}(A)\ \Leftrightarrow \ \exists \ m\ \in \ A.\mathsf{modules}.\ \operatorname{Prefix}(\operatorname{path}(m),\ \operatorname{TestsPrefix}(A)) \\
\operatorname{TestAssemblies}(P)\ =\ [A\ \in \ P.\mathsf{assemblies}\ \mid \ \operatorname{TestBearing}(A)]
\end{array}
$$

$$
\mathsf{TestScope}\ \mathbin{::} =\ \mathsf{AllTests}\ \mid \ \operatorname{AssemblyTests}(A)\ \mid \ \operatorname{ModuleTests}(q)\ \mid \ \operatorname{SourceFileTests}(f)\ \mid \ \operatorname{DirectoryTests}(d)
$$

$$
\begin{array}{l}
\operatorname{ResolveTestTarget}(P,\ \bot )\ =\ \mathsf{AllTests} \\
\operatorname{ResolveTestTarget}(P,\ s)\ =\ \operatorname{SourceFileTests}(p) \\
\ \mathsf{if}\ \operatorname{HostPath}(s)\ \land \ \operatorname{ResolveHostPath}(\mathsf{CurrentDirectory},\ s)\ \Downarrow \ p\ \land \ \operatorname{File}(p) \\
\operatorname{ResolveTestTarget}(P,\ s)\ =\ \mathsf{AllTests} \\
\ \mathsf{if}\ \operatorname{HostPath}(s)\ \land \ \operatorname{ResolveHostPath}(\mathsf{CurrentDirectory},\ s)\ \Downarrow \ p\ \land \ \operatorname{Dir}(p)\ \land \ p\ =\ P.\mathsf{root} \\
\operatorname{ResolveTestTarget}(P,\ s)\ =\ \operatorname{DirectoryTests}(p) \\
\ \mathsf{if}\ \operatorname{HostPath}(s)\ \land \ \operatorname{ResolveHostPath}(\mathsf{CurrentDirectory},\ s)\ \Downarrow \ p\ \land \ \operatorname{Dir}(p)\ \land \ p\ \ne \ P.\mathsf{root} \\
\operatorname{ResolveTestTarget}(P,\ s)\ =\ \operatorname{AssemblyTests}(A) \\
\ \mathsf{if}\ \lnot \ \operatorname{HostPath}(s)\ \land \ A\ \in \ P.\mathsf{assemblies}\ \land \ A.\mathsf{name}\ =\ s \\
\operatorname{ResolveTestTarget}(P,\ s)\ =\ \operatorname{ModuleTests}(q) \\
\ \mathsf{if}\ \lnot \ \operatorname{HostPath}(s)\ \land \ \operatorname{ParseModulePath}(s)\ \Downarrow \ q\ \land \ \exists \ m\ \in \ \operatorname{ModuleList}(P).\ \operatorname{path}(m)\ =\ q \\
\operatorname{ResolveTestTarget}(P,\ s)\ \Uparrow \ \operatorname{Code}(\mathsf{Test}-\mathsf{Target}-\mathsf{Err})\ \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SelectedTests}(P,\ \mathsf{AllTests})\ = \\
\ [\mathsf{proc}\ \mid \ A\ \in \ \operatorname{TestAssemblies}(P),\ \mathsf{proc}\ \in \ \operatorname{TestProceduresUnder}(A,\ \operatorname{TestsPrefix}(A))] \\
\operatorname{SelectedTests}(P,\ \operatorname{AssemblyTests}(A))\ = \\
\ [\mathsf{proc}\ \mid \ \mathsf{proc}\ \in \ \operatorname{TestProceduresUnder}(A,\ \operatorname{TestsPrefix}(A))] \\
\operatorname{SelectedTests}(P,\ \operatorname{ModuleTests}(q))\ = \\
\ [\mathsf{proc}\ \mid \ \mathsf{proc}\ \in \ \operatorname{TestProceduresUnder}(\operatorname{OwnerAssembly}(P,\ q),\ q)] \\
\operatorname{SelectedTests}(P,\ \operatorname{SourceFileTests}(f))\ = \\
\ [\mathsf{proc}\ \mid \ \mathsf{proc}\ \in \ \operatorname{TestProceduresInFile}(P,\ f)\ \land \ \operatorname{InTestsSubtree}(P,\ \mathsf{proc})] \\
\operatorname{SelectedTests}(P,\ \operatorname{DirectoryTests}(d))\ = \\
\ [\mathsf{proc}\ \mid \ \mathsf{proc}\ \in \ \operatorname{TestProceduresUnderDirectory}(P,\ d)\ \land \ \operatorname{InTestsSubtree}(P,\ \mathsf{proc})]
\end{array}
$$

For each selected assembly A represented in SelectedTests(P, scope), `uv test`
generates an ephemeral harness in A's build output directory, compiles
AssemblyProject(P, A) with that harness entrypoint, and invokes the selected
tests for A in deterministic order.

Discovery order is module path, file order, declaration span, then
fully-qualified procedure symbol. The fully-qualified procedure path is the
stable test identity. `name: "..."` is a display label.

### 9.6.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-MOD-2452` | Error    | Compile-time | `[[test]]` applied outside an ordinary procedure |
| `E-TST-0101` | Error    | Compile-time | Malformed `[[test]]` argument                    |
| `E-TST-0102` | Error    | Compile-time | Duplicate `[[test]]` name argument               |
| `E-TST-0103` | Error    | Compile-time | Malformed `covers(...)` argument                 |
| `E-TST-0104` | Error    | Compile-time | Invalid `[[test]]` procedure shape               |
| `E-TST-0105` | Error    | Compile-time | Invalid `TestContext` parameter                  |
| `E-TST-0106` | Error    | Compile-time | `[[test]]` procedure missing postcondition       |
| `E-TST-0107` | Error    | Compile-time | Unknown audit coverage reference                 |
| `E-TST-0108` | Error    | Compile-time | Unknown `uv test` target                         |
