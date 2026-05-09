---
title: Target Profiles and ABI
description: Target profiles, layout, ABI, and backend reference.
---

Ultraviolet's specification defines target profiles, layout, ABI behavior, lowering, symbols, mangling, linkage, and runtime interface rules.

## Target profiles

- `x86_64-sysv`
- `x86_64-win64`
- `aarch64-aapcs64`

Target selection can come from the CLI or the project manifest.

## ABI surfaces

The specification covers:

- primitive layout and encoding;
- permission, pointer, and function layout;
- default calling conventions;
- ABI type lowering;
- parameter and return passing;
- symbol names and mangling;
- linkage for generated symbols;
- runtime symbol mapping.

## Specification

- [1.6 Target and ABI Assumptions](/docs/specification/conformance-and-notation/)
- [23. Foreign Function Interface](/docs/specification/foreign-function-interface/)
- [24. Common Lowering, Program Lifecycle, and Backend](/docs/specification/common-lowering-program-lifecycle-and-backend/)
- [Appendix D. Layout, ABI, and Runtime Reference](/docs/specification/layout-abi-and-runtime-reference/)
