---
title: Build the Compiler
description: Build notes for the Ultraviolet compiler.
---

<aside class="docs-status" data-release-doc-status>
  <strong>Compiler release: <span data-release-version>GitHub release metadata</span>.</strong>
  <span>Release notes, downloadable artifacts, checksum status, and validation state are loaded from GitHub. <a href="https://github.com/blacklight-foundation/ultraviolet/releases" data-release-link>Open current release</a>.</span>
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

The current bootstrap target follows the language repository build notes.

The specification defines these target profiles:

- `x86_64-sysv`
- `x86_64-win64`
- `aarch64-aapcs64`

## Expected output

The build path should produce a compiler executable, validation artifacts, and
enough examples to verify the local toolchain.

## Troubleshooting

- Confirm bootstrap dependencies match the repository notes.
- Confirm the selected target profile matches the active build notes.
- Re-run the build from a clean terminal after changing toolchain or target environment variables.
- Check GitHub Actions and public issues for current build-hardening notes.

## Issues

Compiler build issues can be tracked in the public repository:

[github.com/blacklight-foundation/ultraviolet/issues](https://github.com/blacklight-foundation/ultraviolet/issues)
