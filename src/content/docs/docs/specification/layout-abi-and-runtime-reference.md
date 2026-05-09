---
title: "Layout, ABI, and Runtime Reference"
description: "Appendix D. Layout, ABI, and Runtime Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T18:13:03.158Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## Appendix D. Layout, ABI, and Runtime Reference

Informative. Appendix D cross-indexes layout, ABI, and runtime ownership after reorganization.

| Topic                                                            | Canonical Owner                                                    | Primary Judgments / Relations                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Primitive layout and encoding                                    | `§12.1.5`, `§24.2.1`                                               | `layout(T)`, `ValueBits`, `EncodeConst`                                      |
| Tuples, arrays, slices, and ranges                               | `§12.2.5`, `§12.3.5`, `§12.4.5`, `§12.5.5`, `§24.2.1`, `§24.7.7`   | `TupleLayout`, `ArrayLen`, `SliceBounds`, `RangeBounds`, `LLVMTy`            |
| Records, enums, and unions                                       | `§12.6.5`, `§12.7.5`, `§12.8.5`, `§24.2.1`, `§24.7.7`              | `RecordLayout`, `EnumLayout`, `UnionLayout`, `ValueBits`, `LLVMTy`           |
| Modal, string, and bytes layout                                  | `§13.1.5`, `§13.6.5`, `§13.7.5`, `§24.6.1`, `§24.7.7`              | `ModalLayout`, `ModalBits`, `BuiltinModalLayout`, `LLVMTy`                   |
| Safe pointers, raw pointers, and function/closure representation | `§13.8.5`, `§13.9.5`, `§13.10.5`, `§13.11.5`, `§24.2.2`, `§24.7.7` | `ValueBits`, `LLVMPtrTy`, `LLVMArgAttrs`, `LLVMTy`                           |
| Dynamic class objects and vtables                                | `§14.6.5`, `§14.6.6`, `§24.3`, `§24.7.7`                           | `DynLayout`, `VTable`, `EmitVTable`, `Mangle`, `Linkage`                     |
| Filesystem, network, and system runtime behavior                 | `§6.2.1`, `§6.2.2`, `§6.2.3`, `§6.2.4`                             | `FSJudg`, `FileJudg_ω`, `DirJudg_ω`, `SystemJudg`, `NetworkJudg`, `PrimCall` |
| Program lifecycle and initialization                             | `§24.4`                                                            | `EmitGlobal`, `InitFn`, `DeinitFn`, `ContextInitSym`, `InterpretProject`     |
| Cleanup, drop, and unwinding                                     | `§24.5`                                                            | `CleanupPlan`, `CleanupScope`, `Destroy`, `Unwind`                           |
| Runtime symbol surface                                           | `§24.6`                                                            | `BuiltinModalSym`, `BuiltinSym`, `RuntimeSig`, `RuntimeDecls`                |
| Calling convention and ABI lowering                              | `§24.2.3` to `§24.2.5`                                             | `ABITy`, `ABIParam`, `ABIRet`, `ABICall`                                     |
| Backend requirements and LLVM mapping                            | `§24.7`                                                            | `LLVMPtrAttrs`, `LLVMArgAttrs`, `LLVMUBSafe`, `LLVMTy`                       |
