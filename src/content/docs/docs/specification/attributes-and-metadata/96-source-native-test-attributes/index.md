---
title: "9.6 Source-Native Test Attributes"
description: "9.6 Source-Native Test Attributes from 9. Attributes and Metadata of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "attributes-and-metadata"
specSection: "96-source-native-test-attributes"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/attributes-and-metadata/">9. Attributes and Metadata</a>
  <span>Attributes and Metadata</span>
</div>

## 9.6 Source-Native Test Attributes

### 9.6.1 Syntax

```text
test_attribute      ::= attr_open "test" ("(" test_attribute_args ")")? attr_close
test_attribute_args ::= test_attribute_arg ("," test_attribute_arg)*
test_attribute_arg  ::= "name" ":" string_literal
                      | "covers" "(" string_literal ")"
```

### 9.6.2 Parsing

`#test` is parsed by the ordinary attribute parser from §9.1.2. The `name`
argument is represented as `⟨name, string_literal⟩`. Each `covers(...)` argument

$$
\mathsf{is}\ \mathsf{represented}\ \mathsf{as}\ \texttt{<covers, [string\_literal]>}.
$$

### 9.6.3 AST Representation / Form

A source-native test is an ordinary `ProcedureDecl` whose `AttrByName(proc,
test)` set is non-empty.

$$
\begin{array}{l}
\operatorname{TestName}(\mathsf{proc})\ =\ s\ \mathsf{when}\ \mathsf{the}\ \mathsf{unique}\ \texttt{name: s}\ \mathsf{argument}\ \mathsf{is}\ \mathsf{present}. \\[0.16em]
\operatorname{TestName}(\mathsf{proc})\ =\ \operatorname{FullyQualifiedProcPath}(\mathsf{proc})\ \mathsf{when}\ \mathsf{no}\ \texttt{name}\ \mathsf{argument}\ \mathsf{is}\ \mathsf{present}.
\end{array}
$$

$$
\operatorname{TestCoverage}(\mathsf{proc})\ =\ [r_{1},\ \ldots ,\ r_{n}]\ \mathsf{where}\ \mathsf{each}\ r_{i}\ \mathsf{is}\ \mathsf{the}\ \mathsf{string}\ \mathsf{argument}\ \mathsf{of}\ \mathsf{one}
$$
`covers(r_i)` entry in source order.

### 9.6.4 Static Semantics

`#test` is valid only on ordinary source procedures.

$$
\texttt{AttrArgsOk(test, args)}\ \mathsf{holds}\ \mathsf{exactly}\ \mathsf{when}:
$$

1. every argument is either `name: string_literal` or `covers(string_literal)`;
2. at most one `name` argument is present;
3. every `covers` argument has exactly one non-empty string literal argument;
4. every coverage reference names one row in the obligation ledger using
   `obligation-id@Linternal_spec_line`.

A `#test` procedure MUST:

1. have a body;
2. be non-generic;
3. have explicit visibility;
4. have an explicit return type;
5. have a contract clause containing a postcondition;
6. have either no parameters or exactly one parameter whose type is the
   toolchain-provided `TestAuthority` type.

The `TestAuthority` parameter is the only runner-injected value. It carries the
filesystem, process, temporary-directory, target-profile, and compiler-invocation
authority needed by effectful compiler tests.

### 9.6.5 Dynamic Semantics

`#test` does not change ordinary procedure execution. During test execution,
the runner calls each discovered test procedure. A test passes when the procedure
returns normally and its postcondition is satisfied. A test fails when the
procedure returns normally and its postcondition is violated. A test errors when
the procedure is ill-formed for test execution, panics, requires unavailable
authority, or cannot be invoked by the generated harness.

### 9.6.6 Lowering

`#test` does not lower into production program artifacts.

$$
\mathsf{TestArg}\ =\ \bot \ \mid \ s\ \mathsf{where}\ s\ \mathsf{is}\ \mathsf{the}\ \mathsf{optional}\ \mathsf{positional}\ \mathsf{argument}\ \mathsf{to}\ \texttt{uv test}.
$$

$$
\operatorname{HostPath}(s)\ \Leftrightarrow \ \operatorname{ResolveHostPath}(\mathsf{CurrentDirectory},\ s)\ \Downarrow \ p\ \land \ \operatorname{exists}(p)
$$

$$
\begin{array}{l}
\operatorname{TestInput}(\bot )\ =\ \mathsf{CurrentDirectory} \\[0.16em]
\operatorname{TestInput}(s)\ =\ p\ \mathsf{if}\ \operatorname{HostPath}(s)\ \land \ \operatorname{ResolveHostPath}(\mathsf{CurrentDirectory},\ s)\ \Downarrow \ p \\[0.16em]
\operatorname{TestInput}(s)\ =\ \mathsf{CurrentDirectory}\ \mathsf{if}\ \lnot \ \operatorname{HostPath}(s)
\end{array}
$$

$$
\operatorname{TestRoot}(\mathsf{arg})\ =\ \operatorname{FindProjectRoot}(\operatorname{TestInput}(\mathsf{arg}))
$$

$$
\begin{array}{l}
\operatorname{TestsPrefix}(A)\ =\ A.\mathsf{name}\ \mathbin{::} \ \texttt{Tests} \\[0.16em]
\operatorname{TestBearing}(A)\ \Leftrightarrow \ \exists \ m\ \in \ A.\mathsf{modules}.\ \operatorname{Prefix}(\operatorname{path}(m),\ \operatorname{TestsPrefix}(A)) \\[0.16em]
\operatorname{TestAssemblies}(P)\ =\ [A\ \in \ P.\mathsf{assemblies}\ \mid \ \operatorname{TestBearing}(A)]
\end{array}
$$

$$
\mathsf{TestScope}\ \mathbin{::} =\ \mathsf{AllTests}\ \mid \ \operatorname{AssemblyTests}(A)\ \mid \ \operatorname{ModuleTests}(q)\ \mid \ \operatorname{SourceFileTests}(f)\ \mid \ \operatorname{DirectoryTests}(d)
$$

$$
\begin{array}{l}
\operatorname{ResolveTestTarget}(P,\ \bot )\ =\ \mathsf{AllTests} \\[0.16em]
\operatorname{ResolveTestTarget}(P,\ s)\ =\ \operatorname{SourceFileTests}(p) \\[0.16em]
\ \mathsf{if}\ \operatorname{HostPath}(s)\ \land \ \operatorname{ResolveHostPath}(\mathsf{CurrentDirectory},\ s)\ \Downarrow \ p\ \land \ \operatorname{File}(p) \\[0.16em]
\operatorname{ResolveTestTarget}(P,\ s)\ =\ \mathsf{AllTests} \\[0.16em]
\ \mathsf{if}\ \operatorname{HostPath}(s)\ \land \ \operatorname{ResolveHostPath}(\mathsf{CurrentDirectory},\ s)\ \Downarrow \ p\ \land \ \operatorname{Dir}(p)\ \land \ p\ =\ P.\mathsf{root} \\[0.16em]
\operatorname{ResolveTestTarget}(P,\ s)\ =\ \operatorname{DirectoryTests}(p) \\[0.16em]
\ \mathsf{if}\ \operatorname{HostPath}(s)\ \land \ \operatorname{ResolveHostPath}(\mathsf{CurrentDirectory},\ s)\ \Downarrow \ p\ \land \ \operatorname{Dir}(p)\ \land \ p\ \ne \ P.\mathsf{root} \\[0.16em]
\operatorname{ResolveTestTarget}(P,\ s)\ =\ \operatorname{AssemblyTests}(A) \\[0.16em]
\ \mathsf{if}\ \lnot \ \operatorname{HostPath}(s)\ \land \ A\ \in \ P.\mathsf{assemblies}\ \land \ A.\mathsf{name}\ =\ s \\[0.16em]
\operatorname{ResolveTestTarget}(P,\ s)\ =\ \operatorname{ModuleTests}(q) \\[0.16em]
\ \mathsf{if}\ \lnot \ \operatorname{HostPath}(s)\ \land \ \operatorname{ParseModulePath}(s)\ \Downarrow \ q\ \land \ \exists \ m\ \in \ \operatorname{ModuleList}(P).\ \operatorname{path}(m)\ =\ q \\[0.16em]
\operatorname{ResolveTestTarget}(P,\ s)\ \Uparrow \ \operatorname{Code}(\mathsf{Test}-\mathsf{Target}-\mathsf{Err})\ \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SelectedTests}(P,\ \mathsf{AllTests})\ = \\[0.16em]
\ [\mathsf{proc}\ \mid \ A\ \in \ \operatorname{TestAssemblies}(P),\ \mathsf{proc}\ \in \ \operatorname{TestProceduresUnder}(A,\ \operatorname{TestsPrefix}(A))] \\[0.16em]
\operatorname{SelectedTests}(P,\ \operatorname{AssemblyTests}(A))\ = \\[0.16em]
\ [\mathsf{proc}\ \mid \ \mathsf{proc}\ \in \ \operatorname{TestProceduresUnder}(A,\ \operatorname{TestsPrefix}(A))] \\[0.16em]
\operatorname{SelectedTests}(P,\ \operatorname{ModuleTests}(q))\ = \\[0.16em]
\ [\mathsf{proc}\ \mid \ \mathsf{proc}\ \in \ \operatorname{TestProceduresUnder}(\operatorname{OwnerAssembly}(P,\ q),\ q)] \\[0.16em]
\operatorname{SelectedTests}(P,\ \operatorname{SourceFileTests}(f))\ = \\[0.16em]
\ [\mathsf{proc}\ \mid \ \mathsf{proc}\ \in \ \operatorname{TestProceduresInFile}(P,\ f)\ \land \ \operatorname{InTestsSubtree}(P,\ \mathsf{proc})] \\[0.16em]
\operatorname{SelectedTests}(P,\ \operatorname{DirectoryTests}(d))\ = \\[0.16em]
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
| `E-MOD-2452` | Error    | Compile-time | `#test` applied outside an ordinary procedure |
| `E-TST-0101` | Error    | Compile-time | Malformed `#test` argument                    |
| `E-TST-0102` | Error    | Compile-time | Duplicate `#test` name argument               |
| `E-TST-0103` | Error    | Compile-time | Malformed `covers(...)` argument                 |
| `E-TST-0104` | Error    | Compile-time | Invalid `#test` procedure shape               |
| `E-TST-0105` | Error    | Compile-time | Invalid `TestAuthority` parameter                  |
| `E-TST-0106` | Error    | Compile-time | `#test` procedure missing postcondition       |
| `E-TST-0107` | Error    | Compile-time | Unknown audit coverage reference                 |
| `E-TST-0108` | Error    | Compile-time | Unknown `uv test` target                         |
