---
title: "23.4 FFI Attributes"
description: "23.4 FFI Attributes from 23. Foreign Function Interface of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "foreign-function-interface"
specSection: "234-ffi-attributes"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/foreign-function-interface/">23. Foreign Function Interface</a>
  <span>Foreign Function Interface</span>
</div>

## 23.4 FFI Attributes

### 23.4.1 Syntax

```text
mangle_attribute            ::= "[[" "mangle" "(" mangle_mode ")" "]]"
mangle_mode                 ::= "none" | string_literal

library_attribute           ::= "[[" "library" "(" library_args ")" "]]"
library_args                ::= "name" ":" string_literal ("," "kind" ":" string_literal)?

unwind_attribute            ::= "[[" "unwind" "(" unwind_mode ")" "]]"
unwind_mode                 ::= string_literal

export_attribute            ::= "[[" "export" "(" string_literal ")" "]]"
host_export_attribute       ::= "[[" "host_export" "(" string_literal ")" "]]"

ffi_pass_by_value_attribute ::= "[[" "ffi_pass_by_value" "]]"
```

### 23.4.2 Parsing

FFI attributes are parsed by the general attribute parser in Chapter 5. Argument classification and target checking are defined by Chapter 9 and the attribute-specific constraints below.

### 23.4.3 AST Representation / Form

FFI attributes are ordinary attribute-list entries attached to their owning declarations.

| Attribute           | Target Kinds     |
| :------------------ | :--------------- |
| `mangle`            | `Procedure`      |
| `library`           | `ExternBlock`    |
| `unwind`            | `Procedure`      |
| `export`            | `Procedure`      |
| `host_export`       | `Procedure`      |
| `ffi_pass_by_value` | `Record`, `Enum` |

### 23.4.4 Static Semantics

#### 23.4.4.1 `[[mangle]]`

1. Valid only on extern procedure declarations, raw exported procedures, and hosted exports.
2. `[[mangle(none)]]` sets link name to the declaration identifier (unmangled).
3. `[[mangle("name")]]` sets link name to the exact string.
4. String mode MUST be non-empty and valid for the target linker.
5. On non-FFI procedures, `[[mangle(...)]]` is ill-formed.

#### 23.4.4.2 `[[library]]`

**Link Kinds**

| Kind          | Meaning                   |
| :------------ | :------------------------ |
| `"dylib"`     | Dynamic library (default) |
| `"static"`    | Static library            |
| `"framework"` | macOS framework           |
| `"raw-dylib"` | Windows named DLL import  |

1. Valid only on `extern` blocks.
2. The `name` argument specifies the library name without platform prefix or suffix.
3. If `kind` is omitted, `"dylib"` is assumed.
4. This attribute governs foreign-library resolution only. It is independent of the manifest key `assembly.link_kind` defined in §3.2.
5. Library resolution is:

$$
\begin{array}{l}
\operatorname{ResolveLibraryName}(\texttt{dylib},\ \mathsf{name},\ \texttt{x86\_64-sysv})\ =\ \texttt{"lib"}\ \mathbin{++} \ \mathsf{name}\ \mathbin{++} \ \texttt{".so"} \\[0.16em]
\operatorname{ResolveLibraryName}(\texttt{dylib},\ \mathsf{name},\ \texttt{aarch64-aapcs64})\ =\ \texttt{"lib"}\ \mathbin{++} \ \mathsf{name}\ \mathbin{++} \ \texttt{".so"} \\[0.16em]
\operatorname{ResolveLibraryName}(\texttt{dylib},\ \mathsf{name},\ \texttt{x86\_64-win64})\ =\ \mathsf{name}\ \mathbin{++} \ \texttt{".dll"} \\[0.16em]
\operatorname{ResolveLibraryName}(\texttt{static},\ \mathsf{name},\ \texttt{x86\_64-sysv})\ =\ \texttt{"lib"}\ \mathbin{++} \ \mathsf{name}\ \mathbin{++} \ \texttt{".a"} \\[0.16em]
\operatorname{ResolveLibraryName}(\texttt{static},\ \mathsf{name},\ \texttt{aarch64-aapcs64})\ =\ \texttt{"lib"}\ \mathbin{++} \ \mathsf{name}\ \mathbin{++} \ \texttt{".a"} \\[0.16em]
\operatorname{ResolveLibraryName}(\texttt{static},\ \mathsf{name},\ \texttt{x86\_64-win64})\ =\ \mathsf{name}\ \mathbin{++} \ \texttt{".lib"} \\[0.16em]
\operatorname{ResolveLibraryName}(\texttt{raw-dylib},\ \mathsf{name},\ \texttt{x86\_64-win64})\ =\ \mathsf{name}\ \mathbin{++} \ \texttt{".dll"} \\[0.16em]
\operatorname{LibraryKindSupported}(\texttt{framework},\ \mathsf{profile})\ \Leftrightarrow \ \mathsf{false} \\[0.16em]
\operatorname{LibraryKindSupported}(\texttt{raw-dylib},\ \mathsf{profile})\ \Leftrightarrow \ \mathsf{profile}\ =\ \texttt{x86\_64-win64} \\[0.16em]
\operatorname{LibraryKindSupported}(\mathsf{kind},\ \mathsf{profile})\ \Leftrightarrow \ \mathsf{kind}\ \in \ \{\texttt{dylib},\ \texttt{static}\}
\end{array}
$$

If `LibraryKindSupported(kind, SelectedTargetProfile)` does not hold, the declaration is ill-formed.

For `raw-dylib` imports, the implementation MUST resolve the named Windows DLL
and foreign symbol using the resolved DLL name and declared foreign symbol
name. Resolution strategy is implementation-defined and MAY be lazy; an
implementation is not required to use PE `/DELAYLOAD`.

#### 23.4.4.3 `[[unwind]]`

**Modes**

| Mode      | Behavior                                                                                                |
| :-------- | :------------------------------------------------------------------------------------------------------ |
| `"abort"` | Any panic or foreign unwind that would cross the boundary aborts.                                       |
| `"catch"` | Unwinding is caught at the boundary. Imported procedures convert foreign unwinds to Ultraviolet panics. |

If `[[unwind]]` is not specified, `"abort"` is assumed.

`[[unwind]]` is valid only on extern procedure declarations, raw exported procedures, and hosted exports.

**Catch ABI Requirement.**

If `UnwindMode(proc) = "catch"`, the ABI at the boundary MUST be `"C-unwind"`:
1. For extern procedures: `ExternAbiName(ExternAbiOf(proc)) = "C-unwind"`.
2. For raw exported procedures: `ExportAttr(proc) = ⟨"C-unwind", _⟩`.
3. For hosted exports: `HostExportAttr(proc) = ⟨"C-unwind", _⟩`.

#### 23.4.4.4 `[[export]]`

1. Valid only on procedure declarations.
2. The procedure MUST be `public`.
3. The ABI string selects the foreign calling convention (see §23.2.4).
4. `[[export]]` implies external linkage.
5. Link name selection is defined by `LinkName` (§24.3) and `[[mangle(...)]]`.
6. Raw export signatures MUST satisfy the FFI safety requirements in §§23.3 and 23.5.

#### 23.4.4.5 `[[host_export]]`

1. Valid only on procedure declarations.
2. The procedure MUST be `public`.
3. The owning assembly MUST be a library assembly.
4. `[[host_export]]` implies external linkage through the hosted-export thunk defined in §23.3.13. The source procedure body continues to use ordinary visibility-based linkage for Ultraviolet calls; `[[host_export]]` alone does not make the source procedure body symbol the foreign entrypoint.
5. The ABI string selects the foreign calling convention (see §23.2.4).
6. Link name selection is defined by `LinkName` (§24.3) and `[[mangle(...)]]`.
7. Hosted-export signatures MUST satisfy the hosted-export rules of §§23.3 and 23.5.
8. `[[host_export]]` and `[[export]]` MUST NOT appear in the same assembly.

#### 23.4.4.6 `[[ffi_pass_by_value]]`

This attribute marks a `record` or `enum` that satisfies both `DropType` and `FfiSafeType` as eligible for by-value passing across the FFI boundary. If a `DropType` + `FfiSafeType` type is passed by value in any FFI signature without this attribute, the program is ill-formed (§23.1.4).

**FFI Attribute Constraints**

1. `[[mangle]]` is valid only on extern procedure declarations, raw exported procedures, or hosted exports.
2. Duplicate symbol names within a compilation unit are ill-formed and MUST be diagnosed at compile-time or link-time.
3. `[[library]]` is valid only on `extern` blocks.
4. Unknown library kinds are ill-formed.
5. `[[mangle(none)]]` on a non-FFI procedure is ill-formed.
6. `[[mangle(none)]]` with `[[export("C")]]` is redundant and SHOULD emit a warning.
7. `[[unwind]]` on a non-FFI procedure is ill-formed.
8. `[[unwind("abort")]]` is redundant and SHOULD emit a warning.
9. `[[host_export]]` requires `assembly.kind = "library"`.
10. `[[host_export]]` and `[[export]]` MUST NOT be mixed in the same assembly.

### 23.4.5 Dynamic Semantics

FFI attributes do not directly evaluate to runtime values. `[[unwind]]` selects the boundary behavior defined by §23.7. `[[mangle]]`, `[[library]]`, `[[export]]`, `[[host_export]]`, and `[[ffi_pass_by_value]]` have no direct runtime semantics apart from their effects on linkage, signature admissibility, hosted-session lowering, and boundary behavior.

### 23.4.6 Lowering

`[[mangle]]` selects link names. `[[library]]` contributes library-resolution metadata for extern blocks. `[[export]]` implies external linkage at the raw FFI boundary. `[[host_export]]` selects hosted-library thunk emission and the hosted-session lifecycle exports required by §23.3.13. `[[unwind]]` selects the boundary frame strategy in §23.7. `[[ffi_pass_by_value]]` authorizes by-value ABI lowering for eligible `DropType` + `FfiSafeType` records and enums.

### 23.4.7 Diagnostics

| Code         | Severity | Detection                 | Condition                                                |
| ------------ | -------- | ------------------------- | -------------------------------------------------------- |
| `E-SYS-3340` | Error    | Compile-time              | `[[mangle(...)]]` on non-FFI procedure                   |
| `E-SYS-3341` | Error    | Compile-time              | Invalid `[[mangle(mode)]]` argument                      |
| `E-SYS-3342` | Error    | Compile-time or Link-time | Duplicate symbol name in compilation unit                |
| `E-SYS-3345` | Error    | Compile-time              | `[[library]]` outside `extern` block                     |
| `E-SYS-3346` | Error    | Compile-time              | Unknown or unsupported library kind                      |
| `E-SYS-3347` | Error    | Link-time                 | Library not found                                        |
| `E-SYS-3350` | Error    | Compile-time              | `[[mangle(none)]]` on non-exportable procedure           |
| `E-SYS-3351` | Error    | Compile-time              | Conflicting explicit mangling directives                 |
| `E-SYS-3355` | Error    | Compile-time              | Unknown unwind mode                                      |
| `E-SYS-3356` | Error    | Compile-time              | `[[unwind]]` on non-FFI procedure                        |
| `E-SYS-3357` | Error    | Compile-time              | `[[host_export]]` requires `assembly.kind = "library"`   |
| `E-SYS-3358` | Error    | Compile-time              | `[[host_export]]` and `[[export]]` mixed in one assembly |
| `E-FFI-0350` | Error    | Compile-time              | Multiple `[[unwind]]` attributes                         |
| `W-SYS-3350` | Warning  | Compile-time              | `[[mangle(none)]]` with `[[export("C")]]` (redundant)    |
| `W-SYS-3355` | Warning  | Compile-time              | `[[unwind("abort")]]` (redundant)                        |
