---
title: "24.8 Output and Backend Diagnostics"
description: "24.8 Output and Backend Diagnostics from 24. Common Lowering, Program Lifecycle, and Backend of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "common-lowering-program-lifecycle-and-backend"
specSection: "248-output-and-backend-diagnostics"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/">24. Common Lowering, Program Lifecycle, and Backend</a>
  <span>Common Lowering, Program Lifecycle, and Backend</span>
</div>

## 24.8 Output and Backend Diagnostics

This section owns output-pipeline and backend-emission diagnostics defined by Chapter 24.

| Code         | Severity | Detection    | Condition                                                                |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------ |
| `E-OUT-0401` | Error    | Compile-time | Failed to create output directory (`Out-Dirs-Err`) |
| `E-OUT-0402` | Error    | Compile-time | Failed to emit object file (codegen or write) (`Out-Obj-Err`) |
| `E-OUT-0403` | Error    | Compile-time | Failed to emit IR/bitcode (codegen, assemble, tool resolution, or write) (`Out-IR-Err`) |
| `E-OUT-0404` | Error    | Compile-time | Final artifact tool invocation failed (`Out-Link-Fail`) |
| `E-OUT-0405` | Error    | Compile-time | Required linker or archiver tool not found (`Out-Link-NotFound`) |
| `E-OUT-0406` | Error    | Compile-time | Output path collision detected (`Out-IR-Collision`, `Out-Obj-Collision`) |
| `E-OUT-0407` | Error    | Compile-time | Runtime library missing or unreadable (`Out-Link-Runtime-Missing`) |
| `E-OUT-0408` | Error    | Compile-time | Runtime library missing required symbol(s) (`Out-Link-Runtime-Incompatible`) |
| `E-OUT-0409` | Error    | Compile-time | Selected target profile does not support requested final artifact        |
| `E-OUT-0410` | Error    | Compile-time | LLVM type mapping failed                                                 |
| `E-OUT-0411` | Error    | Compile-time | LLVM IR lowering failed                                                  |
| `E-OUT-0412` | Error    | Compile-time | Binding storage/validity lowering failed                                 |
| `E-OUT-0413` | Error    | Compile-time | LLVM call ABI lowering failed                                            |
| `E-OUT-0414` | Error    | Compile-time | VTable emission failed                                                   |
| `E-OUT-0415` | Error    | Compile-time | Literal data emission failed                                             |
| `E-OUT-0416` | Error    | Compile-time | Runtime built-in symbol resolution failed                                |
| `E-OUT-0417` | Error    | Compile-time | Entrypoint or context construction lowering failed                       |
| `E-OUT-0418` | Error    | Compile-time | Poisoning instrumentation failed                                         |
