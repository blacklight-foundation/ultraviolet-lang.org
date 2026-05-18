---
title: "24.8 Output and Backend Diagnostics"
description: "24.8 Output and Backend Diagnostics from 24. Common Lowering, Program Lifecycle, and Backend of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "common-lowering-program-lifecycle-and-backend"
specSection: "248-output-and-backend-diagnostics"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/">24. Common Lowering, Program Lifecycle, and Backend</a>
  <span>Common Lowering, Program Lifecycle, and Backend</span>
</div>

## 24.8 Output and Backend Diagnostics

This section owns output-pipeline and backend-emission diagnostics defined by Chapter 24.

| Code         | Severity | Detection    | Condition                                                                |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------ |
| `E-OUT-0401` | Error    | Compile-time | Failed to create output directory                                        |
| `E-OUT-0402` | Error    | Compile-time | Failed to emit object file (codegen or write)                            |
| `E-OUT-0403` | Error    | Compile-time | Failed to emit IR/bitcode (codegen, assemble, tool resolution, or write) |
| `E-OUT-0404` | Error    | Compile-time | Final artifact tool invocation failed                                    |
| `E-OUT-0405` | Error    | Compile-time | Required linker or archiver tool not found                               |
| `E-OUT-0406` | Error    | Compile-time | Output path collision detected                                           |
| `E-OUT-0407` | Error    | Compile-time | Runtime library missing or unreadable                                    |
| `E-OUT-0408` | Error    | Compile-time | Runtime library missing required symbol(s)                               |
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
