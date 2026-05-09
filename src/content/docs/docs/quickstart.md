---
title: Quickstart
description: Quickstart for the Ultraviolet public alpha.
---

<aside class="docs-status">
  <strong>Currently in alpha.</strong>
  <span>The command surface exists in source and the public build path is being hardened. This page tracks the canonical public path as releases land.</span>
</aside>

## Prerequisites

- A current Git installation.
- Bootstrap dependencies listed in the language repository.
- Target notes for the active public alpha build path. The first bootstrap target is Windows `x86_64-win64`.
- A terminal with standard shell utilities.

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

`Ultraviolet.toml` declares assemblies:

```toml
[[assembly]]
name = "hello"
kind = "executable"
root = "src"
```

`src/Main.uv`:

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
```

## Status note

The public alpha build path is still being hardened. Use the language repository for current bootstrap dependency notes and this page for the stable public shape as releases land.
