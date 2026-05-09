---
title: Build the Compiler
description: Build notes for the Ultraviolet compiler.
---

<aside class="docs-status">
  <strong>Compiler status: alpha bootstrap.</strong>
  <span>Public build instructions will become canonical as the compiler migration lands in the public Ultraviolet project.</span>
</aside>

## Current build outline

```bash
git clone https://github.com/blacklight-foundation/ultraviolet.git
cd ultraviolet

# Public alpha build command placeholder.
./scripts/build
```

## Expected output

The public alpha build path should produce a compiler executable, smoke-test artifacts, and enough examples to verify the local toolchain.

## Troubleshooting

- Confirm bootstrap dependencies match the repository notes.
- Confirm the selected target profile matches the active build notes. The first bootstrap target is Windows `x86_64-win64`.
- Re-run the build from a clean terminal session after changing toolchain or target environment variables.
- Check public issues for active migration notes and known platform gaps.

## Issues

Compiler build issues can be tracked in the public repository:

[github.com/blacklight-foundation/ultraviolet/issues](https://github.com/blacklight-foundation/ultraviolet/issues)
