---
title: Build the Compiler
description: Source-build notes for the Ultraviolet compiler.
---

<aside class="docs-status" data-release-doc-status>
  <strong>Compiler release: <span data-release-version>GitHub release metadata</span>.</strong>
  <span>Release notes, downloadable artifacts, checksum status, and validation state are loaded from GitHub. <a href="https://github.com/blacklight-foundation/ultraviolet/releases" data-release-link>Open current release</a>.</span>
</aside>

Use this page for source-build orientation. Use the language repository for current dependency details and the [handbook](/docs/handbook/) for compiler behavior.

## Repository shape

The language repository is organized around compiler, runtime, and CLI assemblies:

- `Compiler`
- `Runtime`
- `Tools/Uv`
- `SPECIFICATION.md`
- `Ultraviolet.toml`
- `CompilerRebuildPlan.md`

The initial manifest shape is:

<!-- example-tier: syntax -->
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

Assembly loading, deterministic ordering, source roots, output artifacts, and project diagnostics are specified by [Project and Compilation Model](/docs/handbook/03-project-model/).

## Build outline

<!-- example-tier: illustrative -->
```bash
git clone https://github.com/blacklight-foundation/ultraviolet.git
cd ultraviolet

uv check
uv build
uv test
```

## Target profiles

The handbook describes target and ABI assumptions in [Target and ABI Assumptions](/docs/handbook/02-conformance-behavior/) and backend behavior in [Common Lowering, Program Lifecycle, and Backend](/docs/handbook/28-lifecycle-abi/).

The current target-profile names are:

- `x86_64-sysv`
- `x86_64-win64`
- `aarch64-aapcs64`

## Expected output

A successful source build should produce the compiler executable, validation artifacts, and examples sufficient to exercise the local toolchain against the implemented conformance surface.

## Troubleshooting

- Confirm bootstrap dependencies match the language repository notes.
- Confirm the selected target profile matches the active build notes.
- Re-run the build from a fresh terminal after changing toolchain or target environment variables.
- Check GitHub Actions and public issues for current build-hardening notes.

Compiler build issues are tracked in the public repository: [github.com/blacklight-foundation/ultraviolet/issues](https://github.com/blacklight-foundation/ultraviolet/issues).
