---
title: "9.1 Attribute Syntax and Placement"
description: "9.1 Attribute Syntax and Placement from 9. Attributes and Metadata of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "attributes-and-metadata"
specSection: "91-attribute-syntax-and-placement"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/attributes-and-metadata/">9. Attributes and Metadata</a>
  <span>Attributes and Metadata</span>
</div>

## 9.1 Attribute Syntax and Placement

### 9.1.1 Syntax

```text
attribute_list    ::= attribute+
attribute         ::= "#" attribute_spec
attribute_spec    ::= attribute_name ("(" attribute_args? ")")?
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
                    | identifier "(" attribute_args? ")"
```

The reserved names `dynamic` and `static` are admitted only in the leaf position of `attribute_name`. They MUST NOT appear inside `vendor_prefix`.

An attribute list MUST appear immediately before the declaration or expression it modifies.

### 9.1.2 Parsing

**(Parse-AttrListOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\#"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-AttrListOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\#"})\quad \Gamma \ \vdash \ \operatorname{ParseAttrList}(P)\ \Downarrow \ (P_{1},\ \mathsf{attrs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{attrs})
\end{array}
$$

**(Parse-AttrList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttribute}(P)\ \Downarrow \ (P_{1},\ \mathsf{attr})\quad \Gamma \ \vdash \ \operatorname{ParseAttrListTail}(P_{1},\ [\mathsf{attr}])\ \Downarrow \ (P_{2},\ \mathsf{attrs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrList}(P)\ \Downarrow \ (P_{2},\ \mathsf{attrs})
\end{array}
$$

**(Parse-AttrListTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\#"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrListTail}(P,\ \mathsf{attrs})\ \Downarrow \ (P,\ \mathsf{attrs})
\end{array}
$$

**(Parse-AttrListTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\#"})\quad \Gamma \ \vdash \ \operatorname{ParseAttribute}(P)\ \Downarrow \ (P_{1},\ \mathsf{attr})\quad \Gamma \ \vdash \ \operatorname{ParseAttrListTail}(P_{1},\ \mathsf{attrs}\ \mathbin{++} \ [\mathsf{attr}])\ \Downarrow \ (P_{2},\ \mathsf{attrs}_{1}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrListTail}(P,\ \mathsf{attrs})\ \Downarrow \ (P_{2},\ \mathsf{attrs}_{1})
\end{array}
$$

**(Parse-Attribute)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\#"})\quad \Gamma \ \vdash \ \operatorname{ParseAttrSpec}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{spec}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttribute}(P)\ \Downarrow \ (P_{1},\ \operatorname{Attr}(\mathsf{spec}.\mathsf{name},\ \mathsf{spec}.\mathsf{args}))
\end{array}
$$

**(Parse-AttrSpec)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrName}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseAttrArgsOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrSpec}(P)\ \Downarrow \ (P_{2},\ \operatorname{AttrSpec}(\mathsf{name},\ \mathsf{args}))
\end{array}
$$

**(Parse-AttrArgsOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrArgsOpt}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-AttrArgsOpt-Empty)**
IsPunc(Tok(P), "(")    IsPunc(Tok(Advance(P)), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrArgsOpt}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ [])
\end{array}
$$

**(Parse-AttrArgsOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{")"})\quad \Gamma \ \vdash \ \operatorname{ParseAttrArgList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrArgsOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{args})
\end{array}
$$

**(Parse-AttrArgList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrArg}(P)\ \Downarrow \ (P_{1},\ a)\quad \Gamma \ \vdash \ \operatorname{ParseAttrArgListTail}(P_{1},\ [a])\ \Downarrow \ (P_{2},\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrArgList}(P)\ \Downarrow \ (P_{2},\ \mathsf{args})
\end{array}
$$

**(Parse-AttrArgListTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrArgListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-AttrArgListTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{")"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Punctuator}(\texttt{")"})\}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrArgListTail}(P,\ \mathsf{xs})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{xs})
\end{array}
$$

**(Parse-AttrArgListTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseAttrArg}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ a)\quad \Gamma \ \vdash \ \operatorname{ParseAttrArgListTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [a])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrArgListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

**(Parse-AttrArg-Named-Literal)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{":"})\quad \operatorname{Tok}(\operatorname{Advance}(P_{1})).\mathsf{kind}\ \in \ \mathsf{LiteralKind} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrArg}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P_{1})),\ \langle \mathsf{name},\ \operatorname{Tok}(\operatorname{Advance}(P_{1}))\rangle )
\end{array}
$$

**(Parse-AttrArg-Named-Ident)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{value}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrArg}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{name},\ \mathsf{value}\rangle )
\end{array}
$$

**(Parse-AttrArg-Named-Call)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseAttrArgList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrArg}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \langle \mathsf{name},\ \mathsf{args}\rangle )
\end{array}
$$

**(Parse-AttrArg-Literal)**

$$
\begin{array}{l}
\operatorname{Tok}(P).\mathsf{kind}\ \in \ \mathsf{LiteralKind} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrArg}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Tok}(P))
\end{array}
$$

**(Parse-AttrArg-Ident)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
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
\mathsf{vendor}_{\mathsf{prefix}}\ \mathbin{::} =\ \mathsf{identifier}\ (\texttt{"::"}\ \mathsf{identifier})* \\[0.16em]
\mathsf{AttrArg}\ \mathbin{::} =\ \mathsf{literal}\ \mid \ \mathsf{identifier}\ \mid \ \langle \mathsf{name},\ \mathsf{literal}\rangle \ \mid \ \langle \mathsf{name},\ \mathsf{identifier}\rangle \ \mid \ \langle \mathsf{name},\ \mathsf{args}\rangle \\[0.16em]
\mathsf{AttributeSpec}\ \mathbin{::} =\ \operatorname{Attr}(\mathsf{name}:\ \mathsf{AttrName},\ \mathsf{args}:\ [\mathsf{AttrArg}]) \\[0.16em]
\mathsf{AttributeList}\ \mathbin{::} =\ [\mathsf{AttributeSpec}] \\[0.16em]
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
\operatorname{AttrListOf}(\mathsf{item})\ =\ \mathsf{attrs}\quad \mathsf{if}\ \mathsf{item}.\mathsf{attrs}_{\mathsf{opt}}\ =\ \mathsf{attrs} \\[0.16em]
\operatorname{AttrListOf}(\mathsf{item})\ =\ []\quad \mathsf{if}\ \mathsf{item}.\mathsf{attrs}_{\mathsf{opt}}\ =\ \bot \\[0.16em]
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
\mathsf{AttrRegistry}\ =\ R_{\mathsf{spec}}\ \uplus \ R_{\mathsf{vendor}} \\[0.16em]
R_{\mathsf{vendor}}\ =\ \emptyset
\end{array}
$$

$$
\begin{array}{l}
R_{\mathsf{spec}}\ =\ \{ \\[0.16em]
\ \mathsf{layout},\ \mathsf{inline},\ \mathsf{cold},\ \mathsf{deprecated}, \\[0.16em]
\ \mathsf{dynamic},\ \mathsf{stale}_{\mathsf{ok}}, \\[0.16em]
\ \mathsf{relaxed},\ \mathsf{acquire},\ \mathsf{release},\ \mathsf{acqrel},\ \mathsf{seqcst}, \\[0.16em]
\ \mathsf{static}, \\[0.16em]
\ \mathsf{mangle},\ \mathsf{library},\ \mathsf{unwind}, \\[0.16em]
\ \mathsf{reflect},\ \mathsf{derive},\ \mathsf{emit},\ \mathsf{files}, \\[0.16em]
\ \mathsf{export},\ \mathsf{host}_{\mathsf{export}},\ \mathsf{ffi}_{\mathsf{pass}\_\mathsf{by}\_\mathsf{value}}, \\[0.16em]
\ \mathsf{test} \\[0.16em]
\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AttrTargets}(\mathsf{layout})\ =\ \{\mathsf{Record},\ \mathsf{Enum}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{inline})\ =\ \{\mathsf{Procedure},\ \mathsf{Method}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{cold})\ =\ \{\mathsf{Procedure},\ \mathsf{Method}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{deprecated})\ =\ \{\mathsf{Record},\ \mathsf{Enum},\ \mathsf{Modal},\ \mathsf{Procedure},\ \mathsf{Method},\ \mathsf{Field},\ \mathsf{Binding},\ \mathsf{TypeAlias}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{dynamic})\ =\ \{\mathsf{Record},\ \mathsf{Enum},\ \mathsf{Modal},\ \mathsf{Procedure},\ \mathsf{Method},\ \mathsf{Expression}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{stale}_{\mathsf{ok}})\ =\ \{\mathsf{Binding}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{relaxed})\ =\ \{\mathsf{Expression},\ \mathsf{KeyBlock}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{acquire})\ =\ \{\mathsf{Expression},\ \mathsf{KeyBlock}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{release})\ =\ \{\mathsf{Expression},\ \mathsf{KeyBlock}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{acqrel})\ =\ \{\mathsf{Expression},\ \mathsf{KeyBlock}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{seqcst})\ =\ \{\mathsf{Expression},\ \mathsf{KeyBlock}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{static})\ =\ \{\mathsf{Procedure}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{mangle})\ =\ \{\mathsf{Procedure}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{library})\ =\ \{\mathsf{ExternBlock}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{unwind})\ =\ \{\mathsf{Procedure}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{reflect})\ =\ \{\mathsf{Record},\ \mathsf{Enum},\ \mathsf{Modal}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{derive})\ =\ \{\mathsf{Record},\ \mathsf{Enum},\ \mathsf{Modal}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{emit})\ =\ \{\mathsf{Statement},\ \mathsf{Expression}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{files})\ =\ \{\mathsf{Statement},\ \mathsf{Expression}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{export})\ =\ \{\mathsf{Procedure}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{host}_{\mathsf{export}})\ =\ \{\mathsf{Procedure}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{ffi}_{\mathsf{pass}\_\mathsf{by}\_\mathsf{value}})\ =\ \{\mathsf{Record},\ \mathsf{Enum}\} \\[0.16em]
\operatorname{AttrTargets}(\mathsf{test})\ =\ \{\mathsf{Procedure}\}
\end{array}
$$

$$
\mathsf{AttrListJudg}\ =\ \{\mathsf{AttrListWf}\}
$$

**(AttrList-Ok)**

$$
\begin{array}{l}
A\ =\ [a_{1},\ \ldots ,\ a_{n}]\quad \forall \ i,\ a_{i}\ =\ \langle \mathsf{name}_{i},\ \mathsf{args}_{i}\rangle \quad \forall \ i,\ \mathsf{name}_{i}\ \in \ R_{\mathsf{spec}}\ \cup \ R_{\mathsf{vendor}}\quad \forall \ i,\ \tau \ \in \ \operatorname{AttrTargets}(\mathsf{name}_{i})\quad \forall \ i,\ \operatorname{AttrArgsOk}(\mathsf{name}_{i},\ \mathsf{args}_{i}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AttrListWf}(A,\ \tau )\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(AttrList-Unknown)**

$$
\begin{array}{l}
A\ =\ [a_{1},\ \ldots ,\ a_{n}]\quad \exists \ i,\ a_{i}\ =\ \langle \mathsf{name}_{i},\ \_\rangle \ \land \ \mathsf{name}_{i}\ \notin \ R_{\mathsf{spec}}\ \cup \ R_{\mathsf{vendor}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AttrListWf}(A,\ \tau )\ \Uparrow \ c\quad c\ =\ \operatorname{Code}(\mathsf{Attr}-\mathsf{Unknown})
\end{array}
$$

**(AttrList-Target-Err)**

$$
\begin{array}{l}
A\ =\ [a_{1},\ \ldots ,\ a_{n}]\quad \exists \ i,\ a_{i}\ =\ \langle \mathsf{name}_{i},\ \_\rangle \ \land \ \mathsf{name}_{i}\ \in \ R_{\mathsf{spec}}\ \cup \ R_{\mathsf{vendor}}\ \land \ \tau \ \notin \ \operatorname{AttrTargets}(\mathsf{name}_{i}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AttrListWf}(A,\ \tau )\ \Uparrow \ c\quad c\ =\ \operatorname{Code}(\mathsf{Attr}-\mathsf{Target}-\mathsf{Err})
\end{array}
$$

$$
\operatorname{AttrArgsOk}(\mathsf{name},\ \mathsf{args})\ \Leftrightarrow \ \mathsf{args}\ \mathsf{satisfy}\ \mathsf{the}\ \mathsf{attribute}-\mathsf{specific}\ \mathsf{grammar}\ \mathsf{and}\ \mathsf{constraints}\ \mathsf{in}\ \S \S 9.3- 9.6,\ \S 19.7,\ \S 23.4,\ \mathsf{and}\ \S 23.6,\ \mathsf{or}\ \mathsf{the}\ \mathsf{vendor}-\mathsf{defined}\ \mathsf{schema}\ \mathsf{for}\ \mathsf{name}\ \in \ R_{\mathsf{vendor}}.
$$

Memory-order attributes are well-formed only when attached to key blocks or expressions that contain key acquisition.

For every declaration or expression with an attribute list A and target kind τ, the implementation MUST check Γ ⊢ AttrListWf(A, τ) ⇓ ok.

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
| `E-MOD-2451` | Error    | Compile-time | Unknown attribute name (`Attr-Unknown`) |
| `E-MOD-2452` | Error    | Compile-time | Attribute not valid on target declaration kind (`Attr-Target-Err`) |
