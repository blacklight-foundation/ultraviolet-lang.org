---
title: Build the Compiler
description: Build notes for the Ultraviolet compiler.
---

<aside class="docs-status">
  <strong>Compiler status: alpha bootstrap.</strong>
  <span>The public repository contains Compiler, Runtime, and Tools/Uv source. Public build instructions are being hardened alongside examples, diagnostics, and CI.</span>
</aside>

## Repository shape

The language repository includes:

- `Compiler`
- `Runtime`
- `Tools/Uv`
- `SPECIFICATION.md`
- `Ultraviolet.toml`
- `CompilerRebuildPlan.md`

The initial assemblies are:

```toml
[[assembly]]
name = "UltravioletRT"
kind = "library"
link_kind = "static"
root = "Runtime"

[[assembly]]
name = "UltravioletCompiler"
kind = "library"
link_kind = "static"
root = "Compiler"

[[assembly]]
name = "uv"
kind = "executable"
root = "Tools/Uv"
```

## Current build outline

```bash
git clone https://github.com/blacklight-foundation/ultraviolet.git
cd ultraviolet

uv check
uv build
uv test
```

## Target profile

The first bootstrap target is Windows `x86_64-win64`.

The specification defines these target profiles:

- `x86_64-sysv`
- `x86_64-win64`
- `aarch64-aapcs64`

## Expected output

The alpha build path should produce a compiler executable, smoke-test artifacts, and enough examples to verify the local toolchain.

## Troubleshooting

- Confirm bootstrap dependencies match the repository notes.
- Confirm the selected target profile matches the active build notes.
- Re-run the build from a clean terminal after changing toolchain or target environment variables.
- Check public issues for current build-hardening notes.

## Issues

Compiler build issues can be tracked in the public repository:

[github.com/blacklight-foundation/ultraviolet/issues](https://github.com/blacklight-foundation/ultraviolet/issues)
