---
title: Quickstart
description: Quickstart for the Ultraviolet public alpha.
---

<aside class="docs-status" data-release-doc-status>
  <strong>Compiler release: <span data-release-version>GitHub release metadata</span>.</strong>
  <span>The current release, checksum status, and validation state are loaded from GitHub. <a href="https://github.com/blacklight-foundation/ultraviolet/releases" data-release-link>Open current release</a>.</span>
</aside>

Use this page for the shortest toolchain path. Use the [handbook](/docs/handbook/) for exact language and compiler behavior.

## Install

The installer resolves the current packaged compiler release from [GitHub releases](https://github.com/blacklight-foundation/ultraviolet/releases), uses published SHA-256 metadata when available, and adds the CLI to your PATH.

Linux x86_64 and macOS:

<!-- example-tier: illustrative -->
```bash
curl -fsSL https://ultraviolet-lang.org/install | sh
```

Windows x86_64:

<!-- example-tier: illustrative -->
```powershell
powershell -c "irm https://ultraviolet-lang.org/install.ps1 | iex"
```

Ultraviolet's CLI is named `uv`. If Astral's Python package manager is already installed with the same command name, the installer asks whether to keep Python `uv` available as `pyuv` and install Ultraviolet as `uv`, or install Ultraviolet as `uvc`.

## Minimal project

Create a project directory with an `Ultraviolet.toml` manifest and one source file.

<!-- example-tier: illustrative -->
```text
Ultraviolet.toml
src/
  Main.uv
```

The manifest defines an executable assembly and the source root used by project loading. The canonical manifest behavior is owned by [Project Root and Manifest](/docs/handbook/03-project-model/).

<!-- example-tier: syntax -->
```toml
[[assembly]]
name = "hello"
kind = "executable"
root = "src"
```

The entrypoint receives the executable context capability explicitly.

<!-- example-tier: syntax -->
```text
public procedure main(move ctx: Context) -> i32 {
    return 0
}
```

## Commands

The public command surface is:

<!-- example-tier: illustrative -->
```bash
uv init
uv check
uv build
uv run
uv test
uv clean
uv version
```

Use `uv check` before `uv build` when validating examples. The command-line and tool-resolution rules are specified by [Tool Resolution and IR Assembly Inputs](/docs/handbook/03-project-model/).

## Next

Read [First Program](/docs/first-program/) for the smallest executable shape, then use the [Handbook](/docs/handbook/) as the reference map for language features, diagnostics, grammar, and lowering behavior.
