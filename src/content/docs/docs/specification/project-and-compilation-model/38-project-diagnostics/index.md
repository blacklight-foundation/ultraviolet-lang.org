---
title: "3.8 Project Diagnostics"
description: "3.8 Project Diagnostics from 3. Project and Compilation Model of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "project-and-compilation-model"
specSection: "38-project-diagnostics"
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

## 3.8 Project Diagnostics

This section owns the manifest, assembly-selection, source-root, deterministic-ordering, and project-discovery diagnostics defined by the project-loading rules in Chapter 3.

| Code         | Severity | Detection    | Condition                                                                                    |
| ------------ | -------- | ------------ | -------------------------------------------------------------------------------------------- |
| `E-PRJ-0101` | Error    | Compile-time | `Ultraviolet.toml` not found at project root (`Parse-Manifest-Missing`) |
| `E-PRJ-0102` | Error    | Compile-time | `Ultraviolet.toml` is not valid TOML (`Parse-Manifest-Err`) |
| `E-PRJ-0103` | Error    | Compile-time | Missing required `assembly` table, empty assembly list, required keys, or required key type (`WF-Assembly-Count-Err`, `WF-Assembly-Keys-Err`, `WF-Assembly-Required-Types-Err`, `WF-Assembly-Table-Err`) |
| `E-PRJ-0104` | Error    | Compile-time | Unknown key in `assembly` table or unknown top-level key (`WF-TopKeys-Err`) |
| `E-PRJ-0110` | Error    | Compile-time | Invalid `[toolchain]` section in manifest (`WF-Toolchain-Err`) |
| `E-PRJ-0111` | Error    | Compile-time | Invalid `[build]` section in manifest (`WF-Build-Err`) |
| `E-PRJ-0112` | Error    | Compile-time | No target profile was selected by CLI override or `[toolchain].target_profile`               |
| `E-PRJ-0201` | Error    | Compile-time | `assembly.kind` is not in `{ "executable", "library", "dependency" }` (`WF-Assembly-Kind-Err`) |
| `E-PRJ-0202` | Error    | Compile-time | Duplicate `assembly.name` values (`WF-Assembly-Name-Dup`) |
| `E-PRJ-0203` | Error    | Compile-time | `assembly.name` is not a valid identifier (`WF-Assembly-Name-Err`) |
| `E-PRJ-0204` | Error    | Compile-time | `emit_ir` has invalid value or type (`WF-Assembly-EmitIR-Err`, `WF-Assembly-EmitIRType-Err`) |
| `E-PRJ-0205` | Error    | Compile-time | Assembly selection failed (missing target or target not found) (`Assembly-Select-Err`) |
| `E-PRJ-0206` | Error    | Compile-time | Ambiguous assembly root ownership for overlapping source roots (`WF-Assembly-Root-Owner-Ambiguous`) |
| `E-PRJ-0207` | Error    | Compile-time | `link_kind` has invalid value or type (`WF-Assembly-LinkKind-Err`, `WF-Assembly-LinkKindType-Err`) |
| `E-PRJ-0208` | Error    | Compile-time | `link_kind` is only valid when `assembly.kind = "library"` (`WF-Assembly-LinkKind-Use-Err`) |
| `E-PRJ-0209` | Error    | Compile-time | Assembly dependency graph imports an executable or contains a cycle through linked libraries (`Assembly-Graph-Err`) |
| `E-PRJ-0210` | Error    | Compile-time | Hosted library imports another linked library assembly (`Assembly-Graph-HostedImport-Err`) |
| `E-PRJ-0301` | Error    | Compile-time | `assembly.root` or `out_dir` has invalid type, is absolute, or resolves outside root (`WF-Assembly-OutDir-Path-Err`, `WF-Assembly-OutDirType-Err`, `WF-Assembly-Root-Path-Err`) |
| `E-PRJ-0302` | Error    | Compile-time | `assembly.root` does not exist or is not a directory (`WF-Source-Root-Err`) |
| `E-PRJ-0303` | Error    | Compile-time | Relative path derivation failed during deterministic ordering (file or directory) (`DirSeq-Rel-Fail`, `Disc-Rel-Fail`, `FileOrder-Rel-Fail`, `WF-RelPath-Err`) |
| `E-PRJ-0304` | Error    | Compile-time | Path canonicalization or module path derivation failed due to filesystem error (`Resolve-Canonical-Err`) |
| `E-PRJ-0305` | Error    | Compile-time | Directory enumeration failed during module discovery (`DirSeq-Read-Err`) |
