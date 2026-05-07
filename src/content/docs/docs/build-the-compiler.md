---
title: Build the Compiler
description: Build notes for the Ultraviolet compiler.
---

The compiler is in alpha bootstrap status. Public build instructions will become canonical as the compiler migration lands in the public Ultraviolet project.

## Current build outline

```bash
git clone https://github.com/blacklight-foundation/ultraviolet.git
cd ultraviolet

# Public alpha build command placeholder.
./scripts/build
```

## Expected output

The alpha build path should produce a compiler executable, smoke-test artifacts, and enough examples to verify the local toolchain.

## Troubleshooting

- Confirm the selected LLVM toolchain version matches the repository notes.
- Confirm the C/C++ compiler is available on `PATH`.
- Re-run the build from a clean terminal session after changing toolchain environment variables.
- Check public issues for active migration notes and known platform gaps.

## Issues

Compiler build issues can be tracked in the public repository:

[github.com/blacklight-foundation/ultraviolet/issues](https://github.com/blacklight-foundation/ultraviolet/issues)
