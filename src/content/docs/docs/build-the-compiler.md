---
title: Build the Compiler
description: Build notes for the Ultraviolet compiler.
---

<aside class="docs-status">
  <strong>Compiler status: alpha bootstrap.</strong>
  <span>The public repository contains Compiler, Runtime, and Tools/Uv source. Public build instructions are being hardened alongside examples, diagnostics, and CI.</span>
</aside>

## Current build outline

```bash
git clone https://github.com/blacklight-foundation/ultraviolet.git
cd ultraviolet

uv check
uv build
uv test
```

## Expected output

The public alpha build path should produce a compiler executable, smoke-test artifacts, and enough examples to verify the local toolchain.

## Repository shape

The language repository includes the main public source areas:

- `Compiler`
- `Runtime`
- `Tools/Uv`
- `SPECIFICATION.md`
- `Ultraviolet.toml`

## Troubleshooting

- Confirm bootstrap dependencies match the repository notes.
- Confirm the selected target profile matches the active build notes. The first bootstrap target is Windows `x86_64-win64`.
- The specification defines `x86_64-sysv`, `x86_64-win64`, and `aarch64-aapcs64` target profiles.
- Re-run the build from a clean terminal session after changing toolchain or target environment variables.
- Check public issues for active build-hardening notes and known platform gaps.

## Issues

Compiler build issues can be tracked in the public repository:

[github.com/blacklight-foundation/ultraviolet/issues](https://github.com/blacklight-foundation/ultraviolet/issues)
