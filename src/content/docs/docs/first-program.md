---
title: First Program
description: A minimal Ultraviolet executable.
---

The smallest useful executable shows the three pieces every new project should recognize: a manifest, a source file, and an entrypoint that receives `Context`.

## Manifest

`Ultraviolet.toml` declares the executable assembly and the source root.

<!-- example-tier: syntax -->
```toml
[[assembly]]
name = "hello"
kind = "executable"
root = "src"
```

Manifest loading, assembly records, source roots, and project diagnostics are owned by [Project and Compilation Model](/docs/handbook/03-project-model/).

## Source

Create `src/Main.uv` with a public `main` procedure.

<!-- example-tier: syntax -->
```text
public procedure main(move ctx: Context) -> i32 {
    ctx.io~>consoleWrite("Hello, Ultraviolet!")
    return 0
}
```

The explicit `Context` parameter is part of Ultraviolet's authority model: effect-bearing behavior flows through visible capability values. The relevant reference sections are [Authority Model](/docs/handbook/21-authority-memory/), [Procedure Declarations](/docs/handbook/15-procedures-methods/), and [Call Expressions](/docs/handbook/17-expressions-operators/).

## Check, build, run

<!-- example-tier: illustrative -->
```bash
uv check
uv build
uv run
```

Use `uv check` as the first compiler pass when experimenting with syntax, diagnostics, or examples. The command surface is summarized in [Quickstart](/docs/quickstart/) and specified by [Tool Resolution and IR Assembly Inputs](/docs/handbook/03-project-model/).

## Continue

Move from this page to the [Handbook](/docs/handbook/) when you need exact syntax, typing, dynamic semantics, lowering, diagnostics, or ABI behavior.
