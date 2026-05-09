---
title: Quickstart
description: Quickstart for the Ultraviolet public alpha.
---

<aside class="docs-status">
  <strong>Public alpha.</strong>
  <span>The current repository contains the compiler, runtime, and <code>uv</code> source. The build path is being hardened toward the public specification.</span>
</aside>

## Prerequisites

- Git.
- The bootstrap dependencies listed in the language repository.
- A target profile. The first bootstrap target is Windows `x86_64-win64`.
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
