---
title: Quickstart
description: Quickstart for the Ultraviolet public alpha.
---

<aside class="docs-status">
  <strong>Public alpha.</strong>
  <span>The current repository contains the compiler, runtime, and <code>uv</code> source. The build path is being hardened toward the public specification.</span>
</aside>

## Install

The installer downloads the latest packaged alpha from
[GitHub releases](https://github.com/blacklight-foundation/ultraviolet/releases),
verifies its SHA-256 checksum, and adds the `uv` command to your PATH.

Linux x86_64 and macOS (Apple Silicon):

```bash
curl -fsSL https://ultraviolet-lang.org/install | sh
```

Windows x86_64:

```powershell
powershell -c "irm https://ultraviolet-lang.org/install.ps1 | iex"
```

Prefer manual downloads? Grab an archive directly from
[GitHub releases](https://github.com/blacklight-foundation/ultraviolet/releases),
or follow [Build the Compiler](/docs/build-the-compiler/) to build from
source.

### A note on the `uv` command name

Ultraviolet's CLI is `uv`, which collides with Astral's Python package
manager of the same name. The installer detects an existing Python `uv` and
asks how to proceed: keep it available as `pyuv` and install Ultraviolet as
`uv` (recommended), or install Ultraviolet's CLI as `uvc` and leave Python
`uv` untouched.

## Platform support

Packaged alpha builds ship for Linux x86_64, macOS on Apple Silicon, and
Windows x86_64. The first bootstrap target profile is Windows
`x86_64-win64`. Other targets follow the [public roadmap](/roadmap/).

## Prerequisites

- Git.
- The bootstrap dependencies listed in the language repository's
  [build documentation](https://github.com/blacklight-foundation/ultraviolet).
- A shell with standard build utilities.

## Clone

```bash
git clone https://github.com/blacklight-foundation/ultraviolet.git
cd ultraviolet
```

## Project shape

Minimal executable projects use `.uv` source files and an `Ultraviolet.toml` manifest.

```text
Ultraviolet.toml
src/
  Main.uv
```

```toml
[[assembly]]
name = "hello"
kind = "executable"
root = "src"
```

```text
public procedure main(
    move ctx: Context
) -> i32 {
    return 0
}
```

## Command surface

```bash
uv init
uv check
uv build
uv run
uv test
uv clean
uv version
```

The `--target-profile`, `--quiet`, and `--machine-readable` flags are part of the command surface as well.

## Status note

The public alpha build path is still being hardened. Use the language repository for bootstrap dependency notes and the [Build the Compiler](/docs/build-the-compiler/) page for the current release path.
