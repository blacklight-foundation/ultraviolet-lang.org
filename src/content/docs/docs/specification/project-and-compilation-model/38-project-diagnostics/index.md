---
title: "3.8 Project Diagnostics"
description: "3.8 Project Diagnostics from 3. Project and Compilation Model of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "project-and-compilation-model"
specSection: "38-project-diagnostics"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/project-and-compilation-model/">3. Project and Compilation Model</a>
  <span>Project and Compilation Model</span>
</div>

## 3.8 Project Diagnostics

This section owns the manifest, assembly-selection, source-root, deterministic-ordering, and project-discovery diagnostics defined by the project-loading rules in Chapter 3.

| Code         | Severity | Detection    | Condition                                                                                    |
| ------------ | -------- | ------------ | -------------------------------------------------------------------------------------------- |
| `E-PRJ-0101` | Error    | Compile-time | `Ultraviolet.toml` not found at project root                                                 |
| `E-PRJ-0102` | Error    | Compile-time | `Ultraviolet.toml` is not valid TOML                                                         |
| `E-PRJ-0103` | Error    | Compile-time | Missing required `assembly` table, empty assembly list, required keys, or required key type  |
| `E-PRJ-0104` | Error    | Compile-time | Unknown key in `assembly` table or unknown top-level key                                     |
| `E-PRJ-0110` | Error    | Compile-time | Invalid `[toolchain]` section in manifest                                                    |
| `E-PRJ-0111` | Error    | Compile-time | Invalid `[build]` section in manifest                                                        |
| `E-PRJ-0112` | Error    | Compile-time | No target profile was selected by CLI override or `[toolchain].target_profile`               |
| `E-PRJ-0201` | Error    | Compile-time | `assembly.kind` is not in `{ "executable", "library", "dependency" }`                        |
| `E-PRJ-0202` | Error    | Compile-time | Duplicate `assembly.name` values                                                             |
| `E-PRJ-0203` | Error    | Compile-time | `assembly.name` is not a valid identifier                                                    |
| `E-PRJ-0204` | Error    | Compile-time | `emit_ir` has invalid value or type                                                          |
| `E-PRJ-0205` | Error    | Compile-time | Assembly selection failed (missing target or target not found)                               |
| `E-PRJ-0206` | Error    | Compile-time | Ambiguous assembly root ownership for overlapping source roots                               |
| `E-PRJ-0207` | Error    | Compile-time | `link_kind` has invalid value or type                                                        |
| `E-PRJ-0208` | Error    | Compile-time | `link_kind` is only valid when `assembly.kind = "library"`                                   |
| `E-PRJ-0209` | Error    | Compile-time | Assembly dependency graph imports an executable or contains a cycle through linked libraries |
| `E-PRJ-0210` | Error    | Compile-time | Hosted library imports another linked library assembly                                       |
| `E-PRJ-0301` | Error    | Compile-time | `assembly.root` or `out_dir` has invalid type, is absolute, or resolves outside root         |
| `E-PRJ-0302` | Error    | Compile-time | `assembly.root` does not exist or is not a directory                                         |
| `E-PRJ-0303` | Error    | Compile-time | Relative path derivation failed during deterministic ordering (file or directory)            |
| `E-PRJ-0304` | Error    | Compile-time | Path canonicalization or module path derivation failed due to filesystem error               |
| `E-PRJ-0305` | Error    | Compile-time | Directory enumeration failed during module discovery                                         |
