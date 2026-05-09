---
title: First Program
description: First program notes for the Ultraviolet public alpha.
---

The smallest useful Ultraviolet executable shows three things: a project manifest, a `.uv` source file, and an entrypoint that receives `Context`.

## Manifest

```toml
[[assembly]]
name = "hello"
kind = "executable"
root = "src"
```

The manifest declares an executable assembly named `hello` with source files under `src`.

## Source

```text
public procedure main(move ctx: Context) -> i32 {
    ctx.io~>consoleWrite("Hello, Ultraviolet!)
    return 0
}
```

`Context` is the executable entry capability bundle. Passing it explicitly is part of Ultraviolet's review model: effect-bearing behavior flows through visible values.

## Check, build, run

```bash
uv check
uv build
uv run
```

## Next examples

After this minimal program, the important examples are:

- a contract-bearing procedure;
- a modal type with transitions;
- a permission-qualified function;
- a key-mediated shared access block;
- a CPU dispatch example;
- a GPU dispatch example.

Those examples are covered in the [Language Tour](/docs/language-tour/) and [Core Language Surfaces](/docs/core-language/).
