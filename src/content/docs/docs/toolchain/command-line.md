---
title: Command Line
description: The uv command surface.
---

The public command is `uv`.

## Commands

```bash
uv init
uv check
uv build
uv run
uv test
uv clean
uv version
```

The command parser accepts an empty command as `version`.

## Options

```bash
uv build --target-profile x86_64-win64
uv check --quiet
uv test --machine-readable
```

Supported target profile inputs:

- `x86_64-sysv`
- `x86_64-win64`
- `aarch64-aapcs64`

Supported output modes:

- `normal`
- `quiet`
- `machine-readable`

## Test target

`uv test` accepts zero or one positional target. The target can identify a host path, assembly name, or module path according to the test command model.

## Current implementation status

The command model is present in source. The project pipeline is still being completed during alpha bootstrap work.

## Source references

- `Compiler/Driver/CLI/Options.uv`
- `Compiler/Driver/CLI/Commands.uv`
- `Compiler/Driver/CLI/OptionValues.uv`
- `Compiler/Driver/Pipeline.uv`
