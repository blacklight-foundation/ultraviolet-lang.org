---
title: Project Manifests
description: Ultraviolet.toml project and assembly configuration.
---

Ultraviolet projects are loaded from `Ultraviolet.toml`.

## Assembly tables

```toml
[[assembly]]
name = "hello"
kind = "executable"
root = "src"
```

The required assembly fields are `name`, `kind`, and `root`.

Supported assembly kinds are:

- `executable`
- `library`
- `dependency`

Libraries may set `link_kind` to `shared` or `static`.

## Optional fields

Assemblies may also declare:

- `out_dir`
- `emit_ir`
- `link_kind`

`emit_ir` accepts `none`, `ll`, or `bc`.

## Toolchain table

The specification defines a `toolchain` table for target and toolchain paths:

```toml
[toolchain]
target_profile = "x86_64-win64"
```

Target profile selection can also come from the CLI `--target-profile` option.

## Build table

The specification defines a `build` table with boolean keys such as `incremental` and `progress`.

## Specification

- [3. Project and Compilation Model](/docs/specification/project-and-compilation-model/)
